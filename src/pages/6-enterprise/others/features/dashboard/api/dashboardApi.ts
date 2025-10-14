import { supabase } from '@/shared/supabase/client';
import { DashboardLayout } from '../types/widget';

export class DashboardApi {
  // Save dashboard layout
  static async saveLayout(layout: DashboardLayout): Promise<DashboardLayout> {
    try {
      // TODO: Commented out - 'dashboard_layouts' table doesn't exist yet. Create migration first.
      // const { data, error } = await supabase
      //   .from('dashboard_layouts')
      //   .upsert({
      //     id: layout.id,
      //     user_id: layout.userId,
      //     name: layout.name,
      //     description: layout.description,
      //     is_default: layout.isDefault,
      //     layout_config: {
      //       widgets: layout.widgets,
      //       gridConfig: layout.gridConfig
      //     },
      //     updated_at: new Date().toISOString()
      //   })
      //   .select()
      //   .single();
      // if (error) {
      //   throw new Error(`Failed to save layout: ${error.message}`);
      // }
      // return {
      //   ...layout,
      //   id: data.id,
      //   updatedAt: new Date(data.updated_at)
      // };
      console.log('[dashboardApi] saveLayout called (not persisted - table missing):', layout);
      return { ...layout, updatedAt: new Date() };
    } catch (error) {
      console.error('Error saving dashboard layout:', error);
      throw error;
    }
  }

  // Load dashboard layout by ID
  static async loadLayout(layoutId: string): Promise<DashboardLayout | null> {
    try {
      // TODO: Commented out - 'dashboard_layouts' table doesn't exist yet. Create migration first.
      // const { data, error } = await supabase
      //   .from('dashboard_layouts')
      //   .select('*')
      //   .eq('id', layoutId)
      //   .single();
      // if (error) {
      //   if (error.code === 'PGRST116') {
      //     return null;
      //   }
      //   throw new Error(`Failed to load layout: ${error.message}`);
      // }
      // const layoutConfig = data.layout_config as any;
      // return {
      //   id: data.id,
      //   userId: data.user_id,
      //   name: data.name,
      //   description: data.description || '',
      //   isDefault: data.is_default,
      //   widgets: layoutConfig.widgets || [],
      //   gridConfig: layoutConfig.gridConfig || {
      //     cols: 12,
      //     rowHeight: 60,
      //     margin: [10, 10],
      //     containerPadding: [10, 10],
      //     isDraggable: true,
      //     isResizable: true,
      //     isBounded: true
      //   },
      //   createdAt: new Date(data.created_at),
      //   updatedAt: new Date(data.updated_at)
      // };
      console.log('[dashboardApi] loadLayout called (not persisted - table missing):', layoutId);
      return null;
    } catch (error) {
      console.error('Error loading dashboard layout:', error);
      throw error;
    }
  }

  // Load all layouts for a user
  static async loadUserLayouts(userId: string): Promise<DashboardLayout[]> {
    try {
      // TODO: Commented out - 'dashboard_layouts' table doesn't exist yet. Create migration first.
      // const { data, error } = await supabase
      //   .from('dashboard_layouts')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .order('updated_at', { ascending: false });
      // if (error) {
      //   throw new Error(`Failed to load user layouts: ${error.message}`);
      // }
      // return data.map(item => {
      //   const layoutConfig = item.layout_config as any;
      //   return {
      //     id: item.id,
      //     userId: item.user_id,
      //     name: item.name,
      //     description: item.description || '',
      //     isDefault: item.is_default,
      //     widgets: layoutConfig.widgets || [],
      //     gridConfig: layoutConfig.gridConfig || {
      //       cols: 12,
      //       rowHeight: 60,
      //       margin: [10, 10],
      //       containerPadding: [10, 10],
      //       isDraggable: true,
      //       isResizable: true,
      //       isBounded: true
      //     },
      //     createdAt: new Date(item.created_at),
      //     updatedAt: new Date(item.updated_at)
      //   };
      // });
      console.log('[dashboardApi] loadUserLayouts called (not persisted - table missing):', userId);
      return [];
    } catch (error) {
      console.error('Error loading user layouts:', error);
      throw error;
    }
  }

  // Delete dashboard layout
  static async deleteLayout(layoutId: string): Promise<void> {
    try {
      // TODO: Commented out - 'dashboard_layouts' table doesn't exist yet. Create migration first.
      // const { error } = await supabase
      //   .from('dashboard_layouts')
      //   .delete()
      //   .eq('id', layoutId);
      // if (error) {
      //   throw new Error(`Failed to delete layout: ${error.message}`);
      // }
      console.log('[dashboardApi] deleteLayout called (not persisted - table missing):', layoutId);
    } catch (error) {
      console.error('Error deleting dashboard layout:', error);
      throw error;
    }
  }

  // Set default layout for user
  static async setDefaultLayout(userId: string, layoutId: string): Promise<void> {
    try {
      // TODO: Commented out - 'dashboard_layouts' table doesn't exist yet. Create migration first.
      // await supabase
      //   .from('dashboard_layouts')
      //   .update({ is_default: false })
      //   .eq('user_id', userId);
      // const { error } = await supabase
      //   .from('dashboard_layouts')
      //   .update({ is_default: true })
      //   .eq('id', layoutId)
      //   .eq('user_id', userId);
      // if (error) {
      //   throw new Error(`Failed to set default layout: ${error.message}`);
      // }
      console.log('[dashboardApi] setDefaultLayout called (not persisted - table missing):', { userId, layoutId });
    } catch (error) {
      console.error('Error setting default layout:', error);
      throw error;
    }
  }

  // Duplicate layout
  static async duplicateLayout(layoutId: string, newName: string): Promise<DashboardLayout> {
    try {
      const originalLayout = await this.loadLayout(layoutId);
      if (!originalLayout) {
        throw new Error('Layout not found');
      }

      const duplicatedLayout: DashboardLayout = {
        ...originalLayout,
        id: Math.random().toString(36).substr(2, 9),
        name: newName,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return await this.saveLayout(duplicatedLayout);
    } catch (error) {
      console.error('Error duplicating layout:', error);
      throw error;
    }
  }
}
