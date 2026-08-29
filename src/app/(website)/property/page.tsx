import React, { Suspense } from 'react';
import { PropertyCatalogue } from '@/features/properties/components/PropertyCatalogue';
import { PropertiesGridSkeleton } from '@/features/properties/components/PropertySkeleton';
import { Reveal } from '@/components/reveal';

export const metadata = {
  title: 'Holiday Properties & Luxury Villas | OBS Online Service',
  description: 'Browse luxury lakefront villas, cabins, lodges, and wellness retreats.',
};

export default function PropertiesPage() {
  return (
    <Reveal>
      <Suspense fallback={<PropertiesGridSkeleton count={8} />}>
        <PropertyCatalogue />
      </Suspense>
    </Reveal>
  );
}
