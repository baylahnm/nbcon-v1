# Post Project Routing System Guide

## Overview

The Post Project page implements a comprehensive routing system that manages all interactive elements across three main tabs: Post New Project, Post from Template, and Template Marketplace. This system provides centralized navigation, state management, and action handling.

## Architecture

### Core Components

1. **usePostProjectRouting Hook** - Central routing logic and state management
2. **PostProjectButtonHandler** - Reusable button component with built-in routing
3. **Route Configuration** - Centralized route definitions and permissions
4. **Specialized Button Components** - Pre-configured buttons for common actions

## Button Categories & Routing

### 1. Navigation & Tab Management

| Button Type | Handler | Route | Description |
|-------------|---------|-------|-------------|
| Tab Navigation | `navigateToTab` | `?tab={new\|template\|marketplace}` | Switch between main tabs |
| Section Navigation | `navigateToSection` | `?section={basics\|scope\|requirements\|timeline\|compliance}` | Navigate form sections |
| Previous/Next | `setCurrentSection` | Internal state | Navigate form steps |

### 2. Form Actions & Data Management

| Button Type | Handler | Route | Description |
|-------------|---------|-------|-------------|
| Save Draft | `handleSaveDraft` | Internal action | Save project as draft |
| Submit Project | `handleSubmitProject` | Redirect to team projects | Submit completed project |
| Add Items | `add{Item}` | Internal state | Add deliverables, skills, etc. |
| Remove Items | `remove{Item}` | Internal state | Remove form items |
| Toggle States | `toggle{State}` | Internal state | Toggle checkboxes/options |

### 3. Template Actions

| Button Type | Handler | Route | Description |
|-------------|---------|-------|-------------|
| Use Template | `handleUseTemplate` | `?tab=new` | Load template into form |
| Preview Template | `handlePreviewTemplate` | `?templateId={id}&action=preview` | Show template preview |
| Purchase Template | `handlePurchaseTemplate` | `?templateId={id}&action=purchase` | Purchase marketplace template |
| Create from Current | `handleCreateFromCurrent` | `?tab=template` | Create template from current project |
| Create New Template | `handleCreateNewTemplate` | `?tab=template&action=create` | Start new template creation |

### 4. Filtering & Search

| Button Type | Handler | Route | Description |
|-------------|---------|-------|-------------|
| Clear Filters | `clearFilters` | `?tab={current}` | Reset all filters |
| Quick Filter | `handleQuickFilter` | `?alias={id}` | Apply project alias filter |
| View Mode | `setViewMode` | `?viewMode={grid\|list}` | Toggle grid/list view |
| Set Currency | `setCurrentCurrency` | Internal state | Change currency display |
| Set Sort | `setSortBy` | Internal state | Change sort order |

### 5. Modal Management

| Button Type | Handler | Route | Description |
|-------------|---------|-------|-------------|
| Close Modal | `closeModal` | Remove `templateId` and `action` | Close preview/purchase modals |

## Usage Examples

### Basic Button Usage

```tsx
import { PostProjectButtonHandler } from '@/components/PostProjectButtonHandler';

// Save draft button
<PostProjectButtonHandler type="save-draft">
  Save Draft
</PostProjectButtonHandler>

// Use template button
<PostProjectButtonHandler 
  type="use-template" 
  template={template}
>
  Use Template
</PostProjectButtonHandler>
```

### Specialized Button Components

```tsx
import { 
  SaveDraftButton, 
  SubmitProjectButton, 
  UseTemplateButton,
  PreviewTemplateButton,
  PurchaseTemplateButton,
  ViewModeButton,
  ClearFiltersButton
} from '@/components/PostProjectButtonHandler';

// Pre-configured buttons
<SaveDraftButton disabled={isSubmitting} />
<SubmitProjectButton disabled={!isValid} />
<UseTemplateButton template={template} />
<PreviewTemplateButton template={template} />
<PurchaseTemplateButton template={marketplaceTemplate} />
<ViewModeButton mode="grid" active={viewMode === 'grid'} />
<ClearFiltersButton show={hasActiveFilters} />
```

### Custom Button with Routing

```tsx
<PostProjectButtonHandler
  type="quick-filter"
  aliasId="alias-123"
  className="custom-class"
  onClick={() => console.log('Custom action')}
>
  Filter by Alias
</PostProjectButtonHandler>
```

## URL State Management

The routing system uses URL search parameters to maintain state:

### Main Tab Navigation
- `?tab=new` - Post New Project tab
- `?tab=template` - Post from Template tab  
- `?tab=marketplace` - Template Marketplace tab

### Form Section Navigation
- `?section=basics` - Project Basics section
- `?section=scope` - Scope & Deliverables section
- `?section=requirements` - Requirements section
- `?section=timeline` - Timeline section
- `?section=compliance` - Compliance section

### Template Actions
- `?templateId=123&action=preview` - Preview template modal
- `?templateId=123&action=purchase` - Purchase template flow
- `?action=create` - Create new template

### View Settings
- `?viewMode=grid` - Grid view
- `?viewMode=list` - List view
- `?alias=alias-123` - Filter by project alias

## Permissions & Security

The routing system includes built-in permission checking:

```typescript
// Check if user can perform action
const canPerformAction = validateAction(
  'post-template', 
  'use-template', 
  userPermissions
);

// Route configuration includes permission requirements
{
  path: '/enterprise/post-project',
  permissions: ['enterprise'],
  actions: {
    'submit-project': {
      requiresAuth: true,
      redirectOnSuccess: '/enterprise/team-projects'
    }
  }
}
```

## Error Handling

The system includes comprehensive error handling:

- **Validation Errors**: Form validation before submission
- **Permission Errors**: Check user permissions before actions
- **Network Errors**: Handle API failures gracefully
- **Navigation Errors**: Fallback routes for invalid states

## Toast Notifications

Automatic toast notifications for user feedback:

- Success messages for completed actions
- Error messages for failed operations
- Information messages for state changes
- Warning messages for validation issues

## State Persistence

The routing system maintains state across:

- **URL Parameters**: Tab, section, filters, view mode
- **Local Storage**: Currency preferences, form drafts
- **Context State**: Project data, validation state
- **Session State**: Modal states, temporary selections

## Best Practices

1. **Use Specialized Components**: Prefer specialized button components over generic handlers
2. **Handle Loading States**: Always disable buttons during async operations
3. **Validate Permissions**: Check user permissions before showing actions
4. **Provide Feedback**: Use toast notifications for user feedback
5. **Maintain State**: Use URL parameters for shareable/bookmarkable states
6. **Error Boundaries**: Wrap components in error boundaries for graceful failures

## Migration Guide

To migrate existing buttons to the new routing system:

1. Replace generic Button components with PostProjectButtonHandler
2. Add appropriate type prop for button behavior
3. Pass required data props (template, aliasId, etc.)
4. Remove manual navigation logic
5. Update state management to use routing hooks
6. Test all button interactions and URL state

## Troubleshooting

### Common Issues

1. **Button not responding**: Check type prop and required data props
2. **Navigation not working**: Verify route configuration and permissions
3. **State not persisting**: Check URL parameter handling
4. **Toast not showing**: Verify toast provider is configured
5. **Permission denied**: Check user permissions and route configuration

### Debug Mode

Enable debug logging:

```typescript
// In development
localStorage.setItem('debug-routing', 'true');
```

This will log all routing actions and state changes to the console.
