import {
  AnimatedCard,
  CardBody,
  CardDescription,
  CardTitle,
  CardVisual,
  Visual3,
} from "@/components/ui/animated-card-chart";

export default function AnimatedCardChartDemo() {
  return (
    <AnimatedCard>
      <CardVisual>
        <Visual3 mainColor="hsl(var(--primary))" secondaryColor="hsl(var(--accent))" />
      </CardVisual>
      <CardBody>
        <CardTitle>Engineering Analytics Dashboard</CardTitle>
        <CardDescription>
          Real-time project performance metrics and insights
        </CardDescription>
      </CardBody>
    </AnimatedCard>
  );
}
