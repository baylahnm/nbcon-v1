import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as DialogPrimitive from "@radix-ui/react-dialog";

// --- Utility Function & Radix Primitives ---
type ClassValue = string | number | boolean | null | undefined;
function cn(...inputs: ClassValue[]): string { return inputs.filter(Boolean).join(" "); }
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & { showArrow?: boolean }>(({ className, sideOffset = 4, showArrow = false, ...props }, ref) => ( <TooltipPrimitive.Portal><TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn("relative z-50 max-w-[280px] rounded-md bg-popover text-popover-foreground px-1.5 py-1 text-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)} {...props}>{props.children}{showArrow && <TooltipPrimitive.Arrow className="-my-px fill-popover" />}</TooltipPrimitive.Content></TooltipPrimitive.Portal>));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>>(({ className, align = "center", sideOffset = 4, ...props }, ref) => ( <PopoverPrimitive.Portal><PopoverPrimitive.Content ref={ref} align={align} sideOffset={sideOffset} className={cn("z-50 w-80 rounded-xl bg-popover p-0 text-popover-foreground shadow-md outline-none animate-in data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)} {...props} /></PopoverPrimitive.Portal>));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(({ className, ...props }, ref) => ( <DialogPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)} {...props} />));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(({ className, children, ...props }, ref) => ( <DialogPortal><DialogOverlay /><DialogPrimitive.Content ref={ref} className={cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border-none bg-transparent p-0 shadow-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className)} {...props}><div className="relative bg-card rounded-[28px] overflow-hidden shadow-2xl p-1">{children}<DialogPrimitive.Close className="absolute right-3 top-3 z-10 rounded-full bg-background/50 p-1 hover:bg-accent transition-all"><XIcon className="h-5 w-5 text-muted-foreground hover:text-foreground" /><span className="sr-only">Close</span></DialogPrimitive.Close></div></DialogPrimitive.Content></DialogPortal>));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// --- SVG Icon Components ---
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}> <path d="M12 5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg> );
const Settings2Icon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M20 7h-9" /> <path d="M14 17H5" /> <circle cx="17" cy="17" r="3" /> <circle cx="7" cy="7" r="3" /> </svg> );
const SendIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}> <path d="M12 5.25L12 18.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M18.75 12L12 5.25L5.25 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> </svg> );
const XIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}> <line x1="18" y1="6" x2="6" y2="18" /> <line x1="6" y1="6" x2="18" y2="18" /> </svg> );
const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);
const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>);
const PaintBrushIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg viewBox="0 0 512 512" fill="currentColor" {...props}> <g> <path d="M141.176,324.641l25.323,17.833c7.788,5.492,17.501,7.537,26.85,5.67c9.35-1.877,17.518-7.514,22.597-15.569l22.985-36.556l-78.377-55.222l-26.681,33.96c-5.887,7.489-8.443,17.081-7.076,26.511C128.188,310.69,133.388,319.158,141.176,324.641z"/> <path d="M384.289,64.9c9.527-15.14,5.524-35.06-9.083-45.355l-0.194-0.129c-14.615-10.296-34.728-7.344-45.776,6.705L170.041,228.722l77.067,54.292L384.289,64.9z"/> <path d="M504.745,445.939c-4.011,0-7.254,3.251-7.254,7.262s3.243,7.246,7.254,7.246c4.012,0,7.255-3.235,7.255-7.246S508.757,445.939,504.745,445.939z"/> <path d="M457.425,432.594c3.914,0,7.092-3.179,7.092-7.101c0-3.898-3.178-7.077-7.092-7.077c-3.915,0-7.093,3.178-7.093,7.077C450.332,429.415,453.51,432.594,457.425,432.594z"/> <path d="M164.493,440.972c14.671-20.817,16.951-48.064,5.969-71.089l-0.462-0.97l-54.898-38.675l-1.059-0.105c-25.379-2.596-50.256,8.726-64.928,29.552c-13.91,19.742-18.965,41.288-23.858,62.113c-3.333,14.218-6.778,28.929-13.037,43.05c-5.168,11.695-8.63,15.868-8.654,15.884L0,484.759l4.852,2.346c22.613,10.902,53.152,12.406,83.779,4.156C120.812,482.584,147.76,464.717,164.493,440.972z M136.146,446.504c-0.849,0.567-1.714,1.19-2.629,1.892c-10.06,7.91-23.17,4.505-15.188-11.54c7.966-16.054-6.09-21.198-17.502-10.652c-14.323,13.232-21.044,2.669-18.391-4.634c2.636-7.304,12.155-17.267,4.189-23.704c-4.788-3.882-10.967,1.795-20.833,9.486c-5.645,4.392-18.666,2.968-13.393-16.563c2.863-7.271,6.389-14.275,11.104-20.971c10.24-14.542,27.603-23.083,45.404-22.403l47.021,33.11c6.632,16.548,4.416,35.764-5.823,50.305C146.167,436.411,141.476,441.676,136.146,446.504z"/> <path d="M471.764,441.992H339.549c-0.227-0.477-0.38-1.003-0.38-1.57c0-0.913,0.372-1.73,0.93-2.378h81.531c5.848,0,10.578-4.723,10.578-10.578c0-5.84-4.73-10.571-10.578-10.571H197.765c0.308,15.399-4.116,30.79-13.271,43.786c-11.218,15.925-27.214,28.913-46.196,38.036h303.802c6.551,0,11.864-5.314,11.864-11.872c0-6.559-5.314-11.873-11.864-11.873h-55.392c-3.299,0-5.977-2.668-5.977-5.968c0-1.246,0.47-2.313,1.1-3.267h89.934c6.559,0,11.881-5.305,11.881-11.873C483.645,447.306,478.323,441.992,471.764,441.992z"/> </g> </svg> );
const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg viewBox="0 0 24 24" fill="none" {...props}> <path d="M12 7C9.23858 7 7 9.23858 7 12C7 13.3613 7.54402 14.5955 8.42651 15.4972C8.77025 15.8484 9.05281 16.2663 9.14923 16.7482L9.67833 19.3924C9.86537 20.3272 10.6862 21 11.6395 21H12.3605C13.3138 21 14.1346 20.3272 14.3217 19.3924L14.8508 16.7482C14.9472 16.2663 15.2297 15.8484 15.5735 15.4972C16.456 14.5955 17 13.3613 17 12C17 9.23858 14.7614 7 12 7Z" stroke="currentColor" strokeWidth="2"/> <path d="M12 4V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> <path d="M18 6L19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> <path d="M20 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> <path d="M4 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> <path d="M5 5L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> <path d="M10 17H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> </svg> );
const MicIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}> <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path> <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path> <line x1="12" y1="19" x2="12" y2="23"></line> </svg> );
const ClipboardCheckIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 12 2 2 4-4"/></svg>);
const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const ColumnsIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>);
const AirVentIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 8h12"/><path d="M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12"/><path d="M6.6 15.6A2 2 0 1 0 10 17v-5"/></svg>);
const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>);
const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>);
const DroneIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="2"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>);
const WrenchIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>);
const FlaskConicalIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>);

const BadgeComponent = ({ children, variant = "outline", className = "" }: { children: React.ReactNode; variant?: string; className?: string }) => (
  <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variant === "default" ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80" : variant === "secondary" ? "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80" : "border-border text-foreground", className)}>
    {children}
  </span>
);

const SeparatorComponent = ({ className = "" }: { className?: string }) => (
  <div className={cn("shrink-0 bg-border h-[1px] w-full", className)} />
);

const toolsList = [ 
  { 
    id: 'site-inspection', 
    name: 'Civil Engineer – Site Inspection', 
    icon: ClipboardCheckIcon,
    summary: 'Guide field engineers through capturing hazards, progress notes, and photographic evidence during construction site walks.',
    tools: [
      { label: 'Image Analysis' },
      { label: 'Checklist' },
      { label: 'Report Builder' },
    ],
    workflow: [
      { title: 'Capture Findings' },
      { title: 'Assess Risk' },
      { title: 'Report' },
    ],
  }, 
  { 
    id: 'electrical-design', 
    name: 'Electrical Engineer – Electrical Design', 
    icon: ZapIcon,
    summary: 'Assist with load calculations, protection coordination, and compliance for electrical distribution projects.',
    tools: [
      { label: 'Load Schedule' },
      { label: 'Code Check' },
      { label: 'BOM' },
    ],
    workflow: [
      { title: 'Collect Requirements' },
      { title: 'Design' },
      { title: 'Deliver' },
    ],
  }, 
  { 
    id: 'structural-analysis', 
    name: 'Structural Engineer – Structural Analysis', 
    icon: ColumnsIcon,
    summary: 'Support structural engineers with load combinations, design checks, and reinforcement guidance.',
    tools: [
      { label: 'Load Combos' },
      { label: 'Code Reference' },
      { label: 'Design Summary' },
    ],
    workflow: [
      { title: 'Gather Inputs' },
      { title: 'Run Analysis' },
      { title: 'Recommend' },
    ],
  }, 
  { 
    id: 'hvac-design', 
    name: 'Mechanical Engineer – HVAC Design', 
    icon: AirVentIcon,
    summary: 'Help HVAC engineers size systems and document efficiency strategies for Saudi climates.',
    tools: [
      { label: 'Load Estimator' },
      { label: 'Ventilation' },
      { label: 'System Selection' },
    ],
    workflow: [
      { title: 'Assess' },
      { title: 'Size' },
      { title: 'Advise' },
    ],
  }, 
  { 
    id: 'surveying', 
    name: 'Survey Engineer – Surveying', 
    icon: MapPinIcon,
    summary: 'Coordinate land surveying missions, data validation, and deliverable packaging.',
    tools: [
      { label: 'Geodetics' },
      { label: 'QA' },
      { label: 'Packager' },
    ],
    workflow: [
      { title: 'Plan' },
      { title: 'Collect' },
      { title: 'Deliver' },
    ],
  }, 
  { 
    id: 'hse-consulting', 
    name: 'HSE Engineer – HSE Consulting', 
    icon: ShieldCheckIcon,
    summary: 'Develop health, safety, and environmental plans tailored to project hazards.',
    tools: [
      { label: 'Risk Register' },
      { label: 'Regulations' },
      { label: 'Training' },
    ],
    workflow: [
      { title: 'Profile' },
      { title: 'Plan' },
      { title: 'Deploy' },
    ],
  }, 
  { 
    id: 'drone-surveying', 
    name: 'Drone Survey Engineer – Drone Surveying', 
    icon: DroneIcon,
    summary: 'Plan drone missions, manage regulatory approvals, and streamline post-processing.',
    tools: [
      { label: 'Mission Planner' },
      { label: 'Processing' },
      { label: 'Compliance' },
    ],
    workflow: [
      { title: 'Prepare' },
      { title: 'Execute' },
      { title: 'Process' },
    ],
  }, 
  { 
    id: 'equipment-maintenance', 
    name: 'Maintenance Engineer – Equipment Maintenance', 
    icon: WrenchIcon,
    summary: 'Coordinate diagnostics, spare parts, and downtime planning for heavy equipment.',
    tools: [
      { label: 'Diagnostics' },
      { label: 'Parts Planner' },
      { label: 'Schedule' },
    ],
    workflow: [
      { title: 'Assess' },
      { title: 'Plan' },
      { title: 'Follow Up' },
    ],
  }, 
  { 
    id: 'soil-testing', 
    name: 'Geotechnical Engineer – Soil Testing', 
    icon: FlaskConicalIcon,
    summary: 'Support geotechnical investigations from sampling plans to report drafts.',
    tools: [
      { label: 'Lab Workflow' },
      { label: 'Capacity' },
      { label: 'Report' },
    ],
    workflow: [
      { title: 'Plan' },
      { title: 'Analyze' },
      { title: 'Recommend' },
    ],
  }, 
];

// --- The Final, Self-Contained PromptBox Component ---
export const PromptBox = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, placeholder = "Message...", onChange, ...props }, ref) => {
    const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = React.useState("");
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [selectedTool, setSelectedTool] = React.useState<string | null>(null);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);
    
    React.useImperativeHandle(ref, () => internalTextareaRef.current!, []);
    
    React.useLayoutEffect(() => { 
      const textarea = internalTextareaRef.current; 
      if (textarea) { 
        textarea.style.height = "auto"; 
        const newHeight = Math.min(textarea.scrollHeight, 200); 
        textarea.style.height = `${newHeight}px`; 
      } 
    }, [value]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { 
      setValue(e.target.value); 
      if (onChange) onChange(e); 
    };
    
    const handlePlusClick = () => { fileInputRef.current?.click(); };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
      const file = event.target.files?.[0]; 
      if (file && file.type.startsWith("image/")) { 
        const reader = new FileReader(); 
        reader.onloadend = () => { 
          setImagePreview(reader.result as string); 
        }; 
        reader.readAsDataURL(file); 
      } 
      event.target.value = ""; 
    };
    
    const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => { 
      e.stopPropagation(); 
      setImagePreview(null); 
      if(fileInputRef.current) { 
        fileInputRef.current.value = ""; 
      } 
    };
    
    const hasValue = value.trim().length > 0 || imagePreview;
    const activeTool = selectedTool ? toolsList.find(t => t.id === selectedTool) : null;
    const ActiveToolIcon = activeTool?.icon;

    return (
      <div className={cn("flex flex-col rounded-[28px] p-2 shadow-sm transition-colors bg-background border border-border dark:bg-muted/30 dark:border-border/50 cursor-text", className)}>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*"/>
        
        {imagePreview && ( <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}> <div className="relative mb-1 w-fit rounded-[1rem] px-1 pt-1"> <button type="button" className="transition-transform" onClick={() => setIsImageDialogOpen(true)}> <img src={imagePreview} alt="Image preview" className="h-14.5 w-14.5 rounded-[1rem]" /> </button> <button onClick={handleRemoveImage} className="absolute right-2 top-2 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-foreground transition-colors hover:bg-accent" aria-label="Remove image"> <XIcon className="h-4 w-4" /> </button> </div> <DialogContent> <img src={imagePreview} alt="Full size preview" className="w-full max-h-[95vh] object-contain rounded-[24px]" /> </DialogContent> </Dialog> )}
        
        <textarea ref={internalTextareaRef} rows={1} value={value} onChange={handleInputChange} placeholder={placeholder} className="custom-scrollbar w-full resize-none border-0 bg-transparent p-3 text-foreground placeholder:text-muted-foreground focus:ring-0 focus-visible:outline-none min-h-12" {...props} />
        
        <div className="mt-0.5 p-1 pt-0">
          <TooltipProvider delayDuration={100}>
            <div className="flex items-center gap-2">
              <Tooltip> <TooltipTrigger asChild><button type="button" onClick={handlePlusClick} className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent focus-visible:outline-none"><PlusIcon className="h-6 w-6" /><span className="sr-only">Attach image</span></button></TooltipTrigger> <TooltipContent side="top" showArrow={true}><p>Attach image</p></TooltipContent> </Tooltip>
              
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <button type="button" className="flex h-8 items-center gap-2 rounded-full p-2 text-sm text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-ring">
                        <Settings2Icon className="h-4 w-4" />
                        {!selectedTool && 'Agents'}
                      </button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" showArrow={true}><p>Service Agents</p></TooltipContent>
                </Tooltip>
                <PopoverContent side="top" align="start" className="w-auto min-w-[240px] max-w-[320px] p-3 border border-border/40">
                  <div className="flex flex-col gap-1">
                    {toolsList.map(tool => {
                      // Extract specialist role (before " – ")
                      const roleLabel = tool.name.split(' – ')[0];
                      return (
                        <Popover key={tool.id}>
                          <PopoverTrigger asChild>
                            <button className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm hover:bg-accent transition-colors"> 
                              <tool.icon className="h-4 w-4 flex-shrink-0" /> 
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{roleLabel}</div>
                                <div className="text-xs text-muted-foreground">Click to view details</div>
                              </div> 
                            </button>
                          </PopoverTrigger>
                        <PopoverContent side="right" align="start" sideOffset={12} className="w-80 border border-border/40">
                          <div className="space-y-3 p-3">
                            {/* Header */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-sm font-semibold">{tool.name}</h3>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {tool.summary}
                              </p>
                            </div>

                            {/* Capabilities */}
                            <div className="flex flex-wrap gap-1.5">
                              {tool.tools.map((capability, idx) => (
                                <BadgeComponent key={idx} variant="secondary" className="text-[9px] px-1.5 py-0">
                                  {capability.label}
                                </BadgeComponent>
                              ))}
                            </div>

                            {/* Workflow Stages */}
                            <div className="rounded-md border border-dashed border-muted-foreground/20 p-2.5">
                              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                                Workflow
                              </p>
                              <div className="grid gap-0.5 text-xs text-muted-foreground">
                                {tool.workflow.map((stage, index) => (
                                  <div key={index} className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-semibold text-primary">{index + 1}.</span>
                                    <span>{stage.title}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Footer */}
                            <SeparatorComponent />
                            <div className="flex justify-end">
                              <button 
                                onClick={() => { setSelectedTool(tool.id); setIsPopoverOpen(false); }} 
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
                              >
                                Use Mode
                              </button>
                            </div>
                          </div>
                        </PopoverContent>
                        </Popover>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>

              {activeTool && (
                <>
                  <div className="h-4 w-px bg-border" />
                  <button onClick={() => setSelectedTool(null)} className="flex h-8 items-center gap-2 rounded-full px-2 text-sm hover:bg-accent cursor-pointer text-primary transition-colors flex-row items-center justify-center">
                    {ActiveToolIcon && <ActiveToolIcon className="h-4 w-4" />}
                    {activeTool.name}
                    <XIcon className="h-4 w-4" />
                  </button>
                </>
              )}

              <div className="ml-auto flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent focus-visible:outline-none">
                      <MicIcon className="h-5 w-5" />
                      <span className="sr-only">Record voice</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" showArrow={true}><p>Record voice</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="submit" disabled={!hasValue} className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                      <SendIcon className="h-6 w-6 text-bold" />
                      <span className="sr-only">Send message</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" showArrow={true}><p>Send</p></TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>
        </div>
      </div>
    );
  }
);
PromptBox.displayName = "PromptBox";

