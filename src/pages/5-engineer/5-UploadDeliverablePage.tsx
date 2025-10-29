import { UploadDeliverableContent } from './others/features/deliverables/UploadDeliverableContent';
import { FeatureGate } from '@/components/portal/shared/FeatureGate';

export default function UploadDeliverablePage() {
  return (
    <FeatureGate
      requiredTier="pro"
      featureName="Upload Deliverables"
      featureDescription="Submit project deliverables, manage file uploads, and track submission status with advanced version control"
    >
      <UploadDeliverableContent />
    </FeatureGate>
  );
}
