import { lazy, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroFigma } from "@/components/landing/HeroFigma";
import { Reveal } from "@/components/motion/Reveal";

const PromoCard = lazy(() =>
  import("@/components/landing/PromoCard").then((m) => ({
    default: m.PromoCard,
  })),
);
const StatsRow = lazy(() =>
  import("@/components/landing/StatsRow").then((m) => ({
    default: m.StatsRow,
  })),
);
const EasyStepsFigma = lazy(() =>
  import("@/components/landing/EasyStepsFigma").then((m) => ({
    default: m.EasyStepsFigma,
  })),
);
const ValuePropsDark = lazy(() =>
  import("@/components/landing/ValuePropsDark").then((m) => ({
    default: m.ValuePropsDark,
  })),
);
const SiteFeatures = lazy(() =>
  import("@/components/landing/SiteFeatures").then((m) => ({
    default: m.SiteFeatures,
  })),
);
const AppFeatures = lazy(() =>
  import("@/components/landing/AppFeatures").then((m) => ({
    default: m.AppFeatures,
  })),
);
const QRBannerFigma = lazy(() =>
  import("@/components/landing/QRBannerFigma").then((m) => ({
    default: m.QRBannerFigma,
  })),
);
const StoresGrid = lazy(() =>
  import("@/components/landing/StoresGrid").then((m) => ({
    default: m.StoresGrid,
  })),
);
const PricingFigma = lazy(() =>
  import("@/components/landing/PricingFigma").then((m) => ({
    default: m.PricingFigma,
  })),
);
const BlogsRow = lazy(() =>
  import("@/components/landing/BlogsRow").then((m) => ({
    default: m.BlogsRow,
  })),
);
const FAQFigma = lazy(() =>
  import("@/components/landing/FAQFigma").then((m) => ({
    default: m.FAQFigma,
  })),
);
const FinalCTA = lazy(() =>
  import("@/components/landing/FinalCTA").then((m) => ({
    default: m.FinalCTA,
  })),
);

const SectionFallback = () => (
  <div className="min-h-[200px]" aria-hidden="true" />
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroFigma />
        <Suspense fallback={<SectionFallback />}>
          <Reveal variant="up">
            <PromoCard />
          </Reveal>
          <Reveal variant="scale">
            <StatsRow />
          </Reveal>
          <Reveal variant="up">
            <EasyStepsFigma />
          </Reveal>
          <Reveal variant="fade">
            <ValuePropsDark />
          </Reveal>
          <Reveal variant="up">
            <SiteFeatures />
          </Reveal>
          <Reveal variant="left">
            <AppFeatures />
          </Reveal>
          <Reveal variant="right">
            <QRBannerFigma />
          </Reveal>
          <Reveal variant="up">
            <StoresGrid />
          </Reveal>
          <Reveal variant="scale">
            <PricingFigma />
          </Reveal>
          <Reveal variant="up">
            <BlogsRow />
          </Reveal>
          <Reveal variant="fade">
            <FAQFigma />
          </Reveal>
          <Reveal variant="scale">
            <FinalCTA />
          </Reveal>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
