'use client';

import StoreCatalogue from '../../components/StoreCatalogue';

export default function WoodworkPage() {
  return (
    <StoreCatalogue
      initialCategorySlug="personalised-woodwork"
      title="Personalised Woodwork"
      subtitle="Handcrafted keepsakes in reclaimed timber — engraved plaques, brass-inlaid pieces and bespoke insignia for gifts that outlive the occasion."
      hideCategoryFilter
      dynamicFilterOptions
    />
  );
}