'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Trash2, FileImage } from 'lucide-react'

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([])
  const [assetTypes, setAssetTypes] = useState<string[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/assets')
      const data = await res.json()
      setAssets(data.assets || [])
      setAssetTypes(data.assetTypes || [])
    } catch (err) {
      console.error('Error fetching assets:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (assetId: string) => {
    try {
      const res = await fetch(`/api/admin/assets/download/${assetId}`)
      const data = await res.json()
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank')
      }
    } catch (err) {
      console.error('Error downloading asset:', err)
    }
  }

  const handleDelete = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return
    
    try {
      setDeleting(assetId)
      const res = await fetch('/api/admin/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId })
      })
      
      if (res.ok) {
        setAssets(assets.filter(a => a.id !== assetId))
      }
    } catch (err) {
      console.error('Error deleting asset:', err)
    } finally {
      setDeleting(null)
    }
  }

  const filteredAssets = filter === 'all' 
    ? assets 
    : assets.filter(a => a.asset_type === filter)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A'
    const mb = bytes / (1024 * 1024)
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Assets Management</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-40 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Assets Management</h1>
        <p className="text-muted-foreground">Download and manage your generated content</p>
      </div>

      <div className="mb-6 flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Assets ({assets.length})
        </Button>
        {assetTypes.map((type) => (
          <Button
            key={type}
            variant={filter === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {filteredAssets.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <FileImage className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Assets Yet</h3>
            <p className="text-muted-foreground mb-4">
              Generated content will appear here
            </p>
            <Button asChild>
              <a href="/admin/apps">Browse Apps</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssets.map((asset) => (
            <Card key={asset.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{asset.asset_name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">{asset.asset_type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <div>Created: {formatDate(asset.created_at)}</div>
                    <div>Size: {formatFileSize(asset.file_size)}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownload(asset.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(asset.id)}
                      disabled={deleting === asset.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
