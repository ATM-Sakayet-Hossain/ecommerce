import BannerSlider from "@/components/ecommerce/BannerSlider";
import CategorySlider from "@/components/ecommerce/CategorySlider";
import ProducrSlider from "@/components/ecommerce/ProductSlider";
import PageContainer from "@/components/layout/PageContainer";

export default function Home() {

  return (
    <PageContainer className="space-y-6 py-6 sm:py-8 lg:py-12">
      <BannerSlider />
      <div className="mt-5">
        <CategorySlider />
      </div>
      <div className="mt-5">
        <ProducrSlider tittle="Trending Product" />
      </div>
    </PageContainer>
  );
}
