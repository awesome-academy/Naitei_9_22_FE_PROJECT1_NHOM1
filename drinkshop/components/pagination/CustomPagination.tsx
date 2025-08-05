"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
const CustomPagination = () => {
    return (
        <div className="mt-8 lg:mt-12 mb-8">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" className="hidden sm:flex" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" className="hidden sm:flex">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" className="hidden sm:flex" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
export default CustomPagination
