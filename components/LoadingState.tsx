import { Card, CardContent, CardHeader } from "@/components/ui/card";

type LoadingStateProps = {
  message?: string;
  skeletonCount?: number;
};

export function LoadingState({
  message = "Loading...",
  skeletonCount = 3,
}: LoadingStateProps) {
  return (
    <div className="space-y-4">
      <div className="text-center text-neutral-600">{message}</div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="aspect-[4/3] w-full bg-neutral-200" />
            <CardHeader>
              <div className="h-4 w-3/4 rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-full rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-5/6 rounded bg-neutral-200" />
            </CardHeader>
            <CardContent>
              <div className="h-6 w-1/4 rounded bg-neutral-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

