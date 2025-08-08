'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';

import OrderFilters from '@/components/admin/orders/OrderFilters';
import OrderTableRow from '@/components/admin/orders/OrderTableRow';
import OrderDetailsDialog from '@/components/admin/orders/OrderDetailsDialog';

import { useOrderManagement } from '@/hooks/userOrderManagement';
import { useOrderDetails } from '@/hooks/useOrderDetails';

import type { Address as OrderTableRowAddress } from '@/components/admin/orders/OrderTableRow';
import { ORDER_STATUS, ORDER_STATUS_OPTIONS } from '@/constants/order-status';

const TABLE_HEADERS = [
    'Mã đơn',
    'Khách hàng',
    'Địa chỉ',
    'Tổng giá',
    'Trạng thái',
    'Ngày đặt',
    'Thao tác'
] as const;


const OrderManagement = () => {
    const [filterStatus, setFilterStatus] = useState<string>(ORDER_STATUS.ALL);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const {
        orders,
        usersMap,
        addressesMap,
        isLoadingOrders,
        error,
        loadInitialData,
        updateOrderStatus
    } = useOrderManagement();

    const {
        selectedOrder,
        orderDetails,
        isLoadingDetails,
        openDetails,
        closeDetails
    } = useOrderDetails();

    useEffect(() => {
        loadInitialData();
    }, []);

    const filteredOrders = useMemo(() => {
        if (!orders.length) return [];

        return orders.filter((order) => {
            if (filterStatus !== ORDER_STATUS.ALL && order.status !== filterStatus) {
                return false;
            }

            if (searchQuery.trim()) {
                const user = usersMap.get(order.userId);
                const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
                const searchLower = searchQuery.toLowerCase();

                const matchesId = order.id?.toLowerCase().includes(searchLower);
                const matchesName = fullName.toLowerCase().includes(searchLower);

                return matchesId || matchesName;
            }

            return true;
        });
    }, [orders, filterStatus, searchQuery, usersMap]);

    const tableData = useMemo(() => {
        return filteredOrders.map((order) => {
            const user = usersMap.get(order.userId);
            const address = addressesMap.get(order.addressId);

            const addressForRow: OrderTableRowAddress | undefined = address ? {
                ...address,
                userId: user?.id ?? '',
                firstName: user?.firstName ?? '',
                lastName: user?.lastName ?? '',
                country: address.country ?? '',
            } : undefined;

            return {
                order,
                user,
                address: addressForRow
            };
        });
    }, [filteredOrders, usersMap, addressesMap]);

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Có lỗi xảy ra</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button
                        onClick={loadInitialData}
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đơn hàng</h1>
                <p className="text-gray-600">
                    Tổng cộng: {filteredOrders.length} đơn hàng
                    {filterStatus !== ORDER_STATUS.ALL && ` (lọc: ${ORDER_STATUS_OPTIONS.find(opt => opt.value === filterStatus)?.label})`}
                </p>
            </div>

            {/* Filters */}
            <OrderFilters
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusOptions={ORDER_STATUS_OPTIONS}
            />

            {/* Loading state */}
            {isLoadingOrders ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
                </div>
            ) : (
                <>
                    {/* Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    {TABLE_HEADERS.map((header, index) => (
                                        <TableHead
                                            key={index}
                                            className="font-semibold text-gray-700"
                                        >
                                            {header}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableData.length > 0 ? (
                                    tableData.map(({ order, user, address }) => (
                                        <OrderTableRow
                                            key={order.id}
                                            order={order}
                                            user={user}
                                            address={address}
                                            onOpenDetails={openDetails}
                                            onUpdateStatus={updateOrderStatus}
                                        />
                                    ))
                                ) : (
                                    <TableRow>
                                        <td colSpan={TABLE_HEADERS.length} className="text-center py-8 text-gray-500">
                                            {searchQuery || filterStatus !== ORDER_STATUS.ALL
                                                ? 'Không tìm thấy đơn hàng phù hợp'
                                                : 'Chưa có đơn hàng nào'
                                            }
                                        </td>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}

            {/* Order Details Dialog */}
            {selectedOrder && (
                <OrderDetailsDialog
                    selectedOrder={selectedOrder}
                    orderDetails={orderDetails}
                    isLoadingDetails={isLoadingDetails}
                    usersMap={usersMap}
                    addressesMap={addressesMap}
                    onClose={closeDetails}
                />
            )}
        </div>
    );
};

export default OrderManagement;
