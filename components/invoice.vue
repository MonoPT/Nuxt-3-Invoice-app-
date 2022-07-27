<template>
    <NuxtLink :to="`invoice/${props.invoice.invoiceUID}`" class="invoice flex">
        <div class="left flex">
            <span class="tracking-number">#{{props.invoice.invoiceUID.slice(0,6)}} </span>
            <span class="due-date">{{props.invoice.paymentDueDate}}</span>
            <span class="person">{{props.invoice.clientName}}</span>
        </div>
        <div class="right flex">
            <span class="price"> {{props.invoice.invoiceTotal}} €</span>
            <div class="status-button flex" :class="{
                paid: props.invoice.invoicePaid, 
                draft: props.invoice.invoiceDraft, 
                pending:props.invoice.invoicePending 
            }">
                <span v-if="props.invoice.invoicePaid">Paid</span>
                <span v-if="props.invoice.invoiceDraft">Draft</span>
                <span v-if="props.invoice.invoicePending">Pending</span>
            </div>
            <div class="icon">
                <img src="@/assets/icon-arrow-right.svg" alt="">
            </div>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
    const props = defineProps({
        invoice: Object
    })
</script>

<style scoped lang="scss">
    .invoice {
        text-decoration: none;
        cursor: pointer;
        gap: 16px;
        margin-bottom: 16px;
        color: #fff;
        border-radius: 20px;
        padding: 28px 32px;
        background-color: #1e2139;
        align-items: center;

        span {
            font-size: 13px;
        }

        .left {
            align-items: center;
            flex-basis: 60%;
            gap: 16px;

            span {
                flex: 1;
            }

            .tracking-number {
                text-transform: uppercase;
            }
        }

        .right {
            gap: 16px;
            flex-basis: 40%;
            align-items: center;

            .price {
                flex: 1;
                font-size: 16px;
                font-weight: 600px;
            }
        }
    }
</style>