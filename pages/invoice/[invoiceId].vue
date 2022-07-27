<template>
    <div v-if="invoice" class="invoice-view container" >
        <NuxtLink to="/" class="nav-link flex">
            <img src="@/assets/icon-arrow-left.svg" alt=""> Go back
        </NuxtLink>

        <!--Header-->
        <div class="header flex">
            <div class="left flex">
                <span>Status</span>
                <div class="status-button flex" :class="{
                    paid: invoice.invoicePaid, 
                    draft: invoice.invoiceDraft, 
                    pending:invoice.invoicePending 
                }">
                    <span v-if="invoice.invoicePaid">Paid</span>
                    <span v-if="invoice.invoiceDraft">Draft</span>
                    <span v-if="invoice.invoicePending">Pending</span>
                </div>
            </div>
            <div class="right flex">
                <button @click="toggleEditInvoice()" class="dark-purple">Edit</button>
                <button @click="deleteInvoice()" class="red">Delete</button>
                <button v-if="mainStore.currentInvoice.invoicePending" @click="updateStatusToPaid(mainStore.currentInvoice.docId)" class="green">Mark as paid</button>
                <button v-if="mainStore.currentInvoice.invoiceDraft || mainStore.currentInvoice.invoicePaid" @click="updateStatusToPending(mainStore.currentInvoice.docId)" class="orange">Mark as pending</button>
            </div>
        </div>

        <!--Invoice details-->
        <div class="invoice-details flex flex-column">
            <div class="top flex">
                <div class="left flex flex-column">
                    <p><span>#</span>{{mainStore.currentInvoice.invoiceId}}</p>
                    <p>{{mainStore.currentInvoice.productDescription}}</p>
                </div>
                <div class="right flex flex-column">
                    <p>{{mainStore.currentInvoice.billerStreetAddress}}</p>
                    <p>{{mainStore.currentInvoice.billerCity}}</p>
                    <p>{{mainStore.currentInvoice.billerZipCode}}</p>
                    <p>{{mainStore.currentInvoice.billerCountry}}</p>
                </div>
            </div>
            <div class="middle flex">
                <div class="payment flex flex-column">
                    <h4>Invoice Date</h4>
                    <p>{{mainStore.currentInvoice.invoiceDate}}</p>
                    <h4>Paymnet Date</h4>
                    <p>{{mainStore.currentInvoice.paymentDueDate}}</p>
                </div>
                <div class="bill flex flex-column">
                    <h4>Bill to</h4>
                    <p>{{mainStore.currentInvoice.clientName}}</p>
                    <p>{{mainStore.currentInvoice.clientStreetAddress}}</p>
                    <p>{{mainStore.currentInvoice.clientCity}}</p>
                    <p>{{mainStore.currentInvoice.clientZipCode}}</p>
                    <p>{{mainStore.currentInvoice.clientCountry}}</p>
                </div>
                <div class="send-to flex flex-column">
                    <h4>Sent to</h4>
                    <p>{{mainStore.currentInvoice.clientEmail}}</p>
                </div>
            </div>
            <div class="bottom flex flex-column">
                <div class="billing-items">
                    <div class="heading flex">
                        <p>Item name</p>
                        <p>Qty</p>
                        <p>Price</p>
                        <p>Total</p>
                    </div>
                    <div class="item flex" v-for="(item, i) in mainStore.currentInvoice.invoiceItemList" :key="i">
                        <p>{{item.itemName}}</p>
                        <p>{{item.qty}}</p>
                        <p>{{item.price}} €</p>
                        <p>{{item.total}} €</p>
                    </div>
                </div>
                <div class="total flex">
                    <p>Amount due</p>
                    <p>{{mainStore.currentInvoice.invoiceTotal}} €</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useMainStore } from '~~/store/index'
    const mainStore = useMainStore()

    const $route = useRoute();
    const router = useRouter();
    const invoiceId = $route.params.invoiceId;

    const invoice = <any>ref({})
    onMounted(() => {
        const Currentinvoice = mainStore.invoiceData.find(invoice => {
            if(invoice.invoiceUID === invoiceId) return invoice;
        });
        mainStore.currentInvoice = Currentinvoice
        invoice.value = mainStore.currentInvoice
    })

    const toggleEditInvoice = () => {
        mainStore.TOGGLE_EDIT_INVOICE();
        mainStore.TOGGLE_INVOICE();
    }

    const deleteInvoice = async () => {
        await mainStore.DELTE_INVOICE(mainStore.currentInvoice.docId);
        router.push({ path: "/" });
    }

    const updateStatusToPaid = (docId) => {
        mainStore.UPDATE_STATUS_TO_PAID(docId);
    }

    const updateStatusToPending = (docId) => {
        mainStore.UPDATE_STATUS_TO_PENDING(docId);
    }
    

</script>

<style lang="scss" scoped>
    .invoice-view {
        .nav-link {
            margin-bottom: 32px;
            align-items: center;
            color: #fff;
            font-size: 12px;

            img {
                margin-right: 16px;
                width: 7px;
                height: 10px;
            }
        }

        .header, .invoice-details {
            background-color: #1e2139;
            border-radius: 20px;
        }

        .header {
            align-items: center;
            padding: 24px 32px;
            font-size: 12px;

            .left {
                align-items: center;

                span {
                    color: #dfe3fa;
                    margin-right: 16px;
                }
            }

            .right {
                flex: 1;
                justify-content: flex-end;

                button {
                    color: #fff;
                }
            }
        }

        .invoice-details {
            padding: 48px;
            margin-top: 24px;

            .top {
                div {
                    color: #dfe3fa;
                    flex: 1;
                }

                .left {
                    font-size: 12px;
                    p:first-child {
                        font-size: 24px;
                        text-transform: uppercase;
                        color: #fff;
                        margin-bottom: 8px;
                    }

                    p:nth-child(2) {
                        font-size: 16px;
                    }

                    span {
                        color: #888eb0;
                    }
                }

                .right {
                    font-size: 12px;
                    align-items: flex-end;
                }
            }

            .middle {
                margin-top: 50px;
                color: #dfe3fa;
                gap: 16px;

                h4 {
                    font-size: 12px;
                    font-weight: 400;
                    margin-bottom: 12px;
                }

                p {
                    font-size: 16px;
                }

                .bill, .payment {
                    flex: 1;
                }

                .payment  {
                    h4:nth-child(3) {
                        margin-top: 32px;
                    }
                    
                    p {
                        font-weight: 600;
                    }
                }

                .bill {
                    p:nth-child(2) {
                        font-size: 16px;
                    }

                    p:nth-child(3) {
                        margin-top: auto;
                    }

                    p {
                        font-size: 12px;
                    }
                }

                .send-to {
                    flex: 2;
                }
            }

            .bottom {
                margin-top: 50px;

                .billing-items {
                    padding: 32px;
                    border-radius: 20px 20px 0px 0px;
                    background-color: #252945;

                    .heading {
                        color: #dfe3fa;
                        font-size: 12px;
                        margin-bottom: 32px;

                        p:first-child {
                            flex: 3;
                            text-align: left;
                        }

                        p {
                            flex: 1;
                            text-align: right;
                        }
                    }

                    .item {
                        margin-bottom: 32px;
                        font-size: 13px;
                        color: #fff;

                        &:last-child {
                            margin-bottom: 0;
                        }

                        p:first-child {
                            flex: 3;
                            text-align: left;
                        }

                        p {
                            flex: 1;
                            text-align: right;
                        }
                    }
                }

                .total {
                    color: #fff;
                    padding: 32px;
                    background-color: rgba(12,14,22,0.7);
                    align-items: center;
                    border-radius: 0 0 20px 20px;

                    p {
                        flex: 1;
                        font-size: 12px;
                    }

                    p:nth-child(2) {
                        font-size: 28px;
                        text-align: right;
                    }
                }
            }
        }


    }
</style>