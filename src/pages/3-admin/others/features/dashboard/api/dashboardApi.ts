import { supabase } from '@/shared/supabase/client';
import { DashboardLayout } from '../types/widget';

export class DashboardApi {
  // Save dashboard layout
  // Note: dashboard_layouts table needs to be created in Supabase
  static async saveLayout(layout: DashboardLayout): Promise<DashboardLayout> {
    try {
      // TODO: Uncomment when dashboard_layouts table is created
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
      
      console.log('saveLayout called (table not yet created):', layout);
      return {
        ...layout,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error saving dashboard layout:', error);
      throw error;
    }
  }

  // Load dashboard layout by ID
  // Note: dashboard_layouts table needs to be created in Supabase
  static async loadLayout(layoutId: string): Promise<DashboardLayout | null> {
    try {
      // TODO: Uncomment when dashboard_layouts table is created
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
      //   gridConfig: layoutConfig.gridConfig || { ... },
      //   createdAt: new Date(data.created_at),
      //   updatedAt: new Date(data.updated_at)
      // };
      
      console.log('loadLayout called (table not yet created):', layoutId);
      return null;
    } catch (error) {
      console.error('Error loading dashboard layout:', error);
      return null;
    }
  }

  // Load all layouts for a user
  // Note: dashboard_layouts table needs to be created in Supabase
  static async loadUserLayouts(userId: string): Promise<DashboardLayout[]> {
    try {
      // TODO: Uncomment when dashboard_layouts table is created
      console.log('loadUserLayouts called (table not yet created):', userId);
      return [];
    } catch (error) {
      console.error('Error loading user layouts:', error);
      return [];
    }
  }

  // Delete dashboard layout
  // Note: dashboard_layouts table needs to be created in Supabase
  static async deleteLayout(layoutId: string): Promise<void> {
    try {
      // TODO: Uncomment when dashboard_layouts table is created
      console.log('deleteLayout called (table not yet created):', layoutId);
    } catch (error) {
      console.error('Error deleting dashboard layout:', error);
    }
  }

  // Set default layout for user
  // Note: dashboard_layouts table needs to be created in Supabase
  static async setDefaultLayout(userId: string, layoutId: string): Promise<void> {
    try {
      // TODO: Uncomment when dashboard_layouts table is created
      console.log('setDefaultLayout called (table not yet created):', { userId, layoutId });
    } catch (error) {
      console.error('Error setting default layout:', error);
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
