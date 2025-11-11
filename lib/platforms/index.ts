/**
 * PLATFORM-SPECIFIC POSTING FUNCTIONS
 * Handles posting to different social media platforms
 * Created: Saturday, November 01, 2025 - 2:50 PM ET
 */

// ============================================================================
// TWITTER / X POSTING
// ============================================================================

export async function postToTwitter(params: {
  content: string;
  media_urls: string[];
  access_token: string;
  account: any;
}) {
  const { content, media_urls, access_token } = params;
  
  try {
    // Twitter API v2 endpoint
    const endpoint = 'https://api.twitter.com/2/tweets';
    
    // Upload media first if present
    let mediaIds: string[] = [];
    if (media_urls.length > 0) {
      mediaIds = await uploadTwitterMedia(media_urls, access_token);
    }
    
    // Create tweet payload
    const payload: any = {
      text: content,
    };
    
    if (mediaIds.length > 0) {
      payload.media = {
        media_ids: mediaIds,
      };
    }
    
    // Post tweet
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Twitter API error: ${JSON.stringify(error)}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      post_id: data.data.id,
      url: `https://twitter.com/i/web/status/${data.data.id}`,
    };
    
  } catch (error: unknown) {
    logError('Twitter posting error:', error);
    throw error;
  }
}

async function uploadTwitterMedia(urls: string[], accessToken: string): Promise<string[]> {
  const mediaIds: string[] = [];
  
  for (const url of urls) {
    try {
      // Download media
      const mediaResponse = await fetch(url);
      const mediaBuffer = await mediaResponse.arrayBuffer();
      const mediaBase64 = Buffer.from(mediaBuffer).toString('base64');
      
      // Upload to Twitter
      const uploadEndpoint = 'https://upload.twitter.com/1.1/media/upload.json';
      const uploadResponse = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          media_data: mediaBase64,
        }),
      });
      
      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        mediaIds.push(uploadData.media_id_string);
      }
    } catch (error: unknown) {
      logError('Error uploading Twitter media:', error);
    }
  }
  
  return mediaIds;
}

// ============================================================================
// LINKEDIN POSTING
// ============================================================================

export async function postToLinkedIn(params: {
  content: string;
  media_urls: string[];
  access_token: string;
  account: any;
}) {
  const { content, media_urls, access_token, account } = params;
  
  try {
    // Get LinkedIn user URN
    const personUrn = account.platform_user_id;
    
    // LinkedIn API endpoint
    const endpoint = 'https://api.linkedin.com/v2/ugcPosts';
    
    // Build post payload
    const payload: any = {
      author: `urn:li:person:${personUrn}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: media_urls.length > 0 ? 'IMAGE' : 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };
    
    // Add media if present
    if (media_urls.length > 0) {
      const mediaAssets = await uploadLinkedInMedia(media_urls, access_token, personUrn);
      payload.specificContent['com.linkedin.ugc.ShareContent'].media = mediaAssets;
    }
    
    // Post to LinkedIn
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`LinkedIn API error: ${JSON.stringify(error)}`);
    }
    
    const data = await response.json();
    const postId = data.id.split(':').pop();
    
    return {
      success: true,
      post_id: data.id,
      url: `https://www.linkedin.com/feed/update/${postId}`,
    };
    
  } catch (error: unknown) {
    logError('LinkedIn posting error:', error);
    throw error;
  }
}

async function uploadLinkedInMedia(
  urls: string[],
  accessToken: string,
  personUrn: string
): Promise<any[]> {
  const mediaAssets: any[] = [];
  
  for (const url of urls) {
    try {
      // Register upload
      const registerEndpoint = 'https://api.linkedin.com/v2/assets?action=registerUpload';
      const registerPayload = {
        registerUploadRequest: {
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          owner: `urn:li:person:${personUrn}`,
          serviceRelationships: [
            {
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent',
            },
          ],
        },
      };
      
      const registerResponse = await fetch(registerEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerPayload),
      });
      
      const registerData = await registerResponse.json();
      const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const asset = registerData.value.asset;
      
      // Upload media
      const mediaResponse = await fetch(url);
      const mediaBuffer = await mediaResponse.arrayBuffer();
      
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: mediaBuffer,
      });
      
      mediaAssets.push({
        status: 'READY',
        description: {
          text: '',
        },
        media: asset,
        title: {
          text: '',
        },
      });
      
    } catch (error: unknown) {
      logError('Error uploading LinkedIn media:', error);
    }
  }
  
  return mediaAssets;
}

// ============================================================================
// FACEBOOK POSTING
// ============================================================================

export async function postToFacebook(params: {
  content: string;
  media_urls: string[];
  access_token: string;
  account: any;
}) {
  const { content, media_urls, access_token, account } = params;
  
  try {
    const pageId = account.platform_user_id;
    
    // Determine endpoint based on media
    let endpoint: string;
    let payload: any;
    
    if (media_urls.length === 0) {
      // Text-only post
      endpoint = `https://graph.facebook.com/v18.0/${pageId}/feed`;
      payload = {
        message: content,
        access_token: accessToken,
      };
    } else if (media_urls.length === 1) {
      // Single photo post
      endpoint = `https://graph.facebook.com/v18.0/${pageId}/photos`;
      payload = {
        message: content,
        url: media_urls[0],
        access_token: accessToken,
      };
    } else {
      // Multiple photos - need to upload first
      const photoIds = await uploadFacebookPhotos(media_urls, accessToken, pageId);
      
      endpoint = `https://graph.facebook.com/v18.0/${pageId}/feed`;
      payload = {
        message: content,
        attached_media: photoIds.map(id => ({ media_fbid: id })),
        access_token: accessToken,
      };
    }
    
    // Post to Facebook
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Facebook API error: ${JSON.stringify(error)}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      post_id: data.id || data.post_id,
      url: `https://facebook.com/${data.id || data.post_id}`,
    };
    
  } catch (error: unknown) {
    logError('Facebook posting error:', error);
    throw error;
  }
}

async function uploadFacebookPhotos(
  urls: string[],
  accessToken: string,
  pageId: string
): Promise<string[]> {
  const photoIds: string[] = [];
  
  for (const url of urls) {
    try {
      const endpoint = `https://graph.facebook.com/v18.0/${pageId}/photos`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          published: false, // Unpublished for batch posting
          access_token: accessToken,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        photoIds.push(data.id);
      }
    } catch (error: unknown) {
      logError('Error uploading Facebook photo:', error);
    }
  }
  
  return photoIds;
}

// ============================================================================
// INSTAGRAM POSTING
// ============================================================================

export async function postToInstagram(params: {
  content: string;
  media_urls: string[];
  access_token: string;
  account: any;
}) {
  const { content, media_urls, access_token, account } = params;
  
  try {
    if (media_urls.length === 0) {
      throw new Error('Instagram requires at least one media item');
    }
    
    const instagramAccountId = account.platform_user_id;
    
    // Step 1: Create media container
    const containerEndpoint = `https://graph.facebook.com/v18.0/${instagramAccountId}/media`;
    const containerPayload: any = {
      image_url: media_urls[0],
      caption: content,
      access_token: accessToken,
    };
    
    const containerResponse = await fetch(containerEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(containerPayload),
    });
    
    if (!containerResponse.ok) {
      const error = await containerResponse.json();
      throw new Error(`Instagram container error: ${JSON.stringify(error)}`);
    }
    
    const containerData = await containerResponse.json();
    const creationId = containerData.id;
    
    // Step 2: Publish the media
    const publishEndpoint = `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`;
    const publishPayload = {
      creation_id: creationId,
      access_token: accessToken,
    };
    
    const publishResponse = await fetch(publishEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publishPayload),
    });
    
    if (!publishResponse.ok) {
      const error = await publishResponse.json();
      throw new Error(`Instagram publish error: ${JSON.stringify(error)}`);
    }
    
    const publishData = await publishResponse.json();
    
    return {
      success: true,
      post_id: publishData.id,
      url: `https://instagram.com/p/${publishData.id}`,
    };
    
  } catch (error: unknown) {
    logError('Instagram posting error:', error);
    throw error;
  }
}

// ============================================================================
// PLACEHOLDER FUNCTIONS FOR OTHER PLATFORMS
// ============================================================================

export async function postToTikTok(params: any) {
  // TikTok API implementation
  throw new Error('TikTok posting not yet implemented');
}

export async function postToYouTube(params: any) {
  // YouTube API implementation
  throw new Error('YouTube posting not yet implemented');
}

export async function postToPinterest(params: any) {
  // Pinterest API implementation
  throw new Error('Pinterest posting not yet implemented');
}

export async function postToReddit(params: any) {
  // Reddit API implementation
  throw new Error('Reddit posting not yet implemented');
}

export async function postToDiscord(params: any) {
  const { content, media_urls, account } = params;
  
  try {
    // Discord webhook URL stored in account
    const webhookUrl = account.access_token; // Webhook URL
    
    const payload: any = {
      content: content,
    };
    
    if (media_urls.length > 0) {
      payload.embeds = [{
        image: {
          url: media_urls[0],
        },
      }];
    }
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error('Discord webhook error');
    }
    
    return {
      success: true,
      post_id: 'discord-' + Date.now(),
      url: webhookUrl,
    };
    
  } catch (error: unknown) {
    logError('Discord posting error:', error);
    throw error;
  }
}

export async function postToTelegram(params: any) {
  const { content, media_urls, account } = params;
  
  try {
    const botToken = account.access_token;
    const chatId = account.platform_user_id;
    
    let endpoint: string;
    let payload: any;
    
    if (media_urls.length > 0) {
      endpoint = `https://api.telegram.org/bot${botToken}/sendPhoto`;
      payload = {
        chat_id: chatId,
        photo: media_urls[0],
        caption: content,
      };
    } else {
      endpoint = `https://api.telegram.org/bot${botToken}/sendMessage`;
      payload = {
        chat_id: chatId,
        text: content,
      };
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Telegram API error: ${JSON.stringify(error)}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      post_id: data.result.message_id,
      url: `https://t.me/${chatId}/${data.result.message_id}`,
    };
    
  } catch (error: unknown) {
    logError('Telegram posting error:', error);
    throw error;
  }
}

export async function postToMastodon(params: any) {
  const { content, media_urls, access_token, account } = params;
  
  try {
    const instanceUrl = account.platform_username.split('@')[1]; // Extract instance from @user@instance
    const endpoint = `https://${instanceUrl}/api/v1/statuses`;
    
    // Upload media first
    let mediaIds: string[] = [];
    if (media_urls.length > 0) {
      mediaIds = await uploadMastodonMedia(media_urls, accessToken, instanceUrl);
    }
    
    const payload: any = {
      status: content,
    };
    
    if (mediaIds.length > 0) {
      payload.media_ids = mediaIds;
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Mastodon API error: ${JSON.stringify(error)}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      post_id: data.id,
      url: data.url,
    };
    
  } catch (error: unknown) {
    logError('Mastodon posting error:', error);
    throw error;
  }
}

async function uploadMastodonMedia(
  urls: string[],
  accessToken: string,
  instanceUrl: string
): Promise<string[]> {
  const mediaIds: string[] = [];
  
  for (const url of urls) {
    try {
      const mediaResponse = await fetch(url);
      const mediaBlob = await mediaResponse.blob();
      
      const formData = new FormData();
      formData.append('file', mediaBlob);
      
      const uploadEndpoint = `https://${instanceUrl}/api/v1/media`;
      const uploadResponse = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });
      
      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        mediaIds.push(uploadData.id);
      }
    } catch (error: unknown) {
      logError('Error uploading Mastodon media:', error);
    }
  }
  
  return mediaIds;
}

export async function postToThreads(params: any) {
  // Threads API implementation (similar to Instagram)
  throw new Error('Threads posting not yet implemented');
}
