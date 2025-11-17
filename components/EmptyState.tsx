import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
};

export function EmptyState({
  title = "No items found",
  description = "There are no items to display at this time.",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        {icon && <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-neutral-400">
          {icon}
        </div>}
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      {action && (
        <CardContent className="flex justify-center">
          {action}
        </CardContent>
      )}
    </Card>
  );
}

