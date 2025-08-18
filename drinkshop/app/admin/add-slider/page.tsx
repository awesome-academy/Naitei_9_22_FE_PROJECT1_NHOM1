'use client';

import React from "react";
import { useSlider } from "@/hooks/useSlider";
import AdminPageLayout from "@/components/layout/AdminPageLayout";
import SliderForm from "@/components/admin/slider/SliderForm";
import SliderList from "@/components/admin/slider/SliderList";

const AddSlider = () => {
    const { sliders, loading, error, refetch } = useSlider();

    return (
        <AdminPageLayout>
            <div className="min-h-screen bg-background p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <SliderForm refetch={refetch} />
                        <SliderList
                            sliders={sliders}
                            loading={loading}
                            error={error}
                            refetch={refetch}
                        />
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AddSlider;
