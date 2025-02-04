import { supabase } from '@/lib/supabase'
import { FileNode } from '@/types/file'

export const fileService = {
  async saveFile(userId: string, fileNode: FileNode) {
    const { data, error } = await supabase
      .from('files')
      .upsert({
        id: fileNode.id,
        user_id: userId,
        name: fileNode.name,
        type: fileNode.type,
        content: fileNode.content,
        parent_id: fileNode.parentId,
        updated_at: new Date().toISOString()
      })
    
    if (error) throw error
    return data
  },

  async getUserFiles(userId: string) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return this.buildFileTree(data)
  },

  async deleteFile(fileId: string) {
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId)
    
    if (error) throw error
  },

  buildFileTree(files: any[]): FileNode[] {
    const fileMap = new Map()
    const roots: FileNode[] = []

    files.forEach(file => {
      fileMap.set(file.id, {
        id: file.id,
        name: file.name,
        type: file.type,
        content: file.content,
        parentId: file.parent_id,
        children: []
      })
    })

    files.forEach(file => {
      const node = fileMap.get(file.id)
      if (file.parent_id) {
        const parent = fileMap.get(file.parent_id)
        if (parent) {
          parent.children.push(node)
        }
      } else {
        roots.push(node)
      }
    })

    return roots
  }
} 