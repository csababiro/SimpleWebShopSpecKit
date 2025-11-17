import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while loading the data. Please try again.",
  onRetry,
  retryLabel = "Try Again",
}: ErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-red-900">{title}</CardTitle>
        <CardDescription className="text-base text-red-700">
          {message}
        </CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent className="flex justify-center">
          <Button onClick={onRetry} variant="outline" className="border-red-300 text-red-900 hover:bg-red-100">
            {retryLabel}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

