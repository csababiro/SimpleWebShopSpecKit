import { LoadingState } from "@/components/LoadingState";

export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingState message="Loading product details..." skeletonCount={1} />
    </div>
  );
}

