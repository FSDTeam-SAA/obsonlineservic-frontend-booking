import React, { Suspense } from 'react';
import PropertyDetailsPage from './_components/PropertyDetailsPage';
import { PropertyDetailsSkeleton } from '@/features/properties/components/PropertyDetailsSkeleton';
import { Reveal } from '@/components/reveal';

export const metadata = {
  title: 'Property Details | OBS Online Service',
  description: 'View detailed amenities, pricing, specifications, and guest reviews.',
};

export default function Page() {
  return (
    <Reveal>
      <Suspense fallback={<PropertyDetailsSkeleton />}>
        <PropertyDetailsPage />
      </Suspense>
    </Reveal>
  );
}
