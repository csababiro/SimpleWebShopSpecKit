import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <EmptyState
        title="Product Not Found"
        description="The product you're looking for doesn't exist or has been removed."
      />
      <div className="mt-6 flex justify-center">
        <Link href="/">
          <Button>← Back to Products</Button>
        </Link>
      </div>
    </div>
  );
}

