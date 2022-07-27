<template>
    <div @click="checkClick" ref="invoiceWrap" class="invoice-wrap flex flex-comlumn">
        <form @submit.prevent="submitForm" :class="`invoice-content ${uploadingData ? 'loading' : ''}`" ref="invoiceModalFormElement">
            <loading v-show="uploadingData"/>
            <h1 v-if="!mainStore.editInvoice">New invoice</h1>
            <h1 v-else>Edit invoice</h1>

            <!--Bill from-->
            <div class="bill-from flex flex-column">
                <h4>Bill from</h4>
                <div class="input flex flex-column">
                    <label for="billerStreetAddress">Street adress</label>
                    <input type="text" id="billerStreetAddress" v-model="billerStreetAddress" required>
                </div>

                <div class="location-details flex">
                    <div class="input flex flex-column">
                        <label for="billerCity">City</label>
                        <input type="text" id="billerCity" v-model="billerCity" required>
                    </div>
                    <div class="input flex flex-column">
                        <label for="billerZipCode">Zip-code</label>
                        <input type="text" id="billerZipCode" v-model="billerZipCode" required>
                    </div>
                    <div class="input flex flex-column">
                        <label for="billerCountry">Country</label>
                        <input type="text" id="billerCountry" v-model="billerCountry" required>
                    </div>
                </div>
            </div>

            <!--Bill to-->
            <div class="bill-to flex flex-column">
                <h4>Bill to</h4>
                <div class="input flex flex-column">
                    <label for="clientName">Client`s name</label>
                    <input type="text" id="clientName" v-model="clientName" required>
                </div>

                <div class="input flex flex-column">
                    <label for="clientEmail">Client`s email</label>
                    <input type="text" id="clientEmail" v-model="clientEmail" required>
                </div>

                <div class="input flex flex-column">
                    <label for="clientStreetAddress">Street adress</label>
                    <input type="text" id="clientStreetAddress" v-model="clientStreetAddress" required>
                </div>

                <div class="location-details flex">
                    <div class="input flex flex-column">
                        <label for="clientCity">City</label>
                        <input type="text" id="clientCity" v-model="clientCity" required>
                    </div>
                    <div class="input flex flex-column">
                        <label for="clientZipCode">Zip-code</label>
                        <input type="text" id="clientZipCode" v-model="clientZipCode" required>
                    </div>
                    <div class="input flex flex-column">
                        <label for="clientCountry">Country</label>
                        <input type="text" id="clientCountry" v-model="clientCountry" required>
                    </div>
                </div>
            </div>

            <!--Invoice work Details-->
            <div class="invoice-work flex flex-column">
                <div class="payment flex">
                    <div class="input flex flex-column">
                        <label for="invoiceDate">Invoice date</label>
                        <input type="text" id="invoiceDate" v-model="invoiceDate" disabled>
                    </div>
                    <div class="input flex flex-column">
                        <label for="paymentDueDate">Payment due</label>
                        <input type="text" id="paymentDueDate" v-model="paymentDueDate" disabled>
                    </div>
                </div>
                <div class="input flex flex-column">
                    <label for="paymentTerms">Payment terms</label>
                    <select type="text" id="paymentTerms" v-model="paymentTerms" required>
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                    </select>
                </div>
                <div class="input flex flex-column">
                    <label for="productDescription">Product description</label>
                    <input type="text" id="productDescription" v-model="productDescription" required>
                </div>

                <div class="work-items">
                    <h3>Item list</h3>
                    <div class="item-list">
                        <div class="heading flex">
                            <div class="item-name">Item name</div>
                            <div class="qty">Qty</div>
                            <div class="price">Price</div>
                            <div class="total">Total</div>
                        </div>
                        <div class="items flex" v-for="(item,i) in invoiceItemList" :key="i">
                            <div class="item-name"><input type="text" v-model="item.itemName"></div>
                            <div class="qty"><input type="text" v-model="item.qty"></div>
                            <div class="price"><input type="text" v-model="item.price"></div>
                            <div class="total">{{item.total = item.qty * item.price}}€</div>
                            <img @click="deleteInvoiceItem(item.id)" src="@/assets/icon-delete.svg" alt="">
                        </div>
                    </div>
                    <div @click="addNewInvoiceItem" class="button flex">
                        <img src="@/assets/icon-plus.svg" alt="">
                        Add new item
                    </div>
                </div>
            </div>

            <!--save/exit-->
            <div class="save flex">
                <div class="left">
                    <button @click="closeInvoice" class="red">Cancel</button>
                </div>
                <div class="right flex">
                    <button v-if="!mainStore.editInvoice" type="submit" @click="saveDraft" class="dark-purple">Save draft</button>
                    <button v-if="!mainStore.editInvoice" type="submit" @click="publishInvoice" class="purple">Create invoice</button>
                    <button v-if="mainStore.editInvoice" type="submit" class="purple">Update invoice</button>
                </div>
            </div>

        </form> 
    </div>
</template>

<script setup lang="ts">
    import { useMainStore } from '~~/store/index'
    import { useUUID } from '@/composables/uuid'
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";
    import { collection, addDoc, setDoc, doc  } from "firebase/firestore";
    import db from "@/fireabse/firebaseINIT"


    const mainStore = useMainStore();
    const uploadingData = ref<boolean>(false)
    const invoiceModalFormElement = ref(null)

    const $route = useRoute();
    const invoiceId = $route.params.invoiceId;

    const  invoiceUID = ref(null);
    const  docId = ref(null)
    const  billerStreetAddress = ref(null);
    const  billerCity = ref(null);
    const  billerZipCode = ref(null);
    const  billerCountry = ref(null);
    const  clientName = ref(null);
    const  clientEmail = ref(null);
    const  clientStreetAddress = ref(null);
    const  clientCity = ref(null);
    const  clientZipCode = ref(null);
    const  clientCountry = ref(null);
    const  invoiceDateUnix = ref(null);
    const  invoiceDate = ref(null);
    const  paymentTerms = ref(null);
    const  paymentDueDateUnix = ref(null);
    const  paymentDueDate = ref(null);
    const  productDescription = ref(null);
    const  invoicePending = ref(null);
    const  invoiceDraft = ref(null);
    const  invoiceItemList = ref([]);
    const  invoiceTotal = ref(null);

    onMounted(() => {
        if(!mainStore.editInvoice){
            invoiceDateUnix.value = Date.now();
            invoiceDate.value = new Date(invoiceDateUnix.value).toLocaleDateString("pt-PT", {
                year: 'numeric',
                month: "short",
                day: 'numeric'
            })
        } else {
            const currentInvoice:any = mainStore.currentInvoice;
            
            invoiceUID.value = currentInvoice.invoiceUID;
            docId.value = currentInvoice.docId;
            billerStreetAddress.value = currentInvoice.billerStreetAddress;
            billerCity.value = currentInvoice.billerCity;
            billerZipCode.value = currentInvoice.billerZipCode;
            billerCountry.value = currentInvoice.billerCountry;
            clientName.value = currentInvoice.clientName;
            clientEmail.value = currentInvoice.clientEmail;
            clientStreetAddress.value = currentInvoice.clientStreetAddress;
            clientCity.value = currentInvoice.clientCity;
            clientZipCode.value = currentInvoice.clientZipCode;
            clientCountry.value = currentInvoice.clientCountry;
            invoiceDateUnix.value = currentInvoice.invoiceDateUnix;
            invoiceDate.value = currentInvoice.invoiceDate;
            paymentTerms.value = currentInvoice.paymentTerms;
            paymentDueDateUnix.value = currentInvoice.paymentDueDateUnix;
            paymentDueDate.value = currentInvoice.paymentDueDate;
            productDescription.value = currentInvoice.productDescription;
            invoicePending.value = currentInvoice.invoicePending;
            invoiceDraft.value = currentInvoice.invoiceDraft;
            invoiceItemList.value = currentInvoice.invoiceItemList;
            invoiceTotal.value = currentInvoice.invoiceTotal;
        }
    })

    watch(paymentTerms, (newValue:string, oldValue:string) => {
        const futureDate = new Date();
        paymentDueDateUnix.value = futureDate.setDate(new Date().getDay() + parseInt(newValue));
        paymentDueDate.value = new Date(paymentDueDateUnix.value).toLocaleDateString("pt-PT", {
            year: 'numeric',
            month: "short",
            day: 'numeric'
        })
    })

    const checkClick = () => {

    }

    const deleteInvoiceItem = (id:string) => {
        invoiceItemList.value = invoiceItemList.value.filter((item) => {
            if(id !== item.id) return item
        })
    }

    const addNewInvoiceItem = () => {
        const newId = useUUID();
        invoiceItemList.value.push({
            id: newId,
            itemName: '',
            qty: '',
            price: 0,
            total: 0
        })
    }

    const saveDraft = () => {
        invoiceDraft.value = true;
    }

    const publishInvoice = () => {
        invoicePending.value = true;
    }

    const submitForm = () => {
        if(!mainStore.editInvoice) uploadInvoice();
        else updateInvoice();
        
    }

    const closeInvoice = () => {
        mainStore.invoiceModal = false;
        mainStore.editInvoice = false;
    }

    function calculateInvoiceTotal() {
        invoiceTotal.value = 0;
        invoiceItemList.value.forEach(item => {
            invoiceTotal.value += item.total;
        });
    }

    async function uploadInvoice() {
        if(invoiceItemList.value.length < 1) {
            alert("Please fill out work items")
            return;
        }

        await invoiceModalFormElement.value.scrollTo({top: 0});


        uploadingData.value = true;

        calculateInvoiceTotal();
        
        try { //Add data to firebase DB
            const docRef = await addDoc(collection(db, "invoices"), {
                invoiceUID: useUUID(),
                billerStreetAddress: billerStreetAddress.value,
                billerCity: billerCity.value,
                billerZipCode: billerZipCode.value,
                billerCountry: billerCountry.value,
                clientName: clientName.value,
                clientEmail: clientEmail.value,
                clientStreetAddress: clientStreetAddress.value,
                clientCity: clientCity.value,
                clientZipCode: clientZipCode.value,
                clientCountry: clientCountry.value,
                invoiceDateUnix: invoiceDateUnix.value,
                invoiceDate: invoiceDate.value,
                paymentTerms: paymentTerms.value, 
                paymentDueDateUnix: paymentDueDateUnix.value, 
                paymentDueDate: paymentDueDate.value,
                productDescription: productDescription.value, 
                invoicePending: invoicePending.value,
                invoiceDraft: invoiceDraft.value,
                invoiceItemList: invoiceItemList.value, 
                invoiceTotal: invoiceTotal.value
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }

        uploadingData.value = false;

        mainStore.invoiceModal = false

        mainStore.GET_INVOICES();
    }

    async function updateInvoice() {
        if(invoiceItemList.value.length < 1) {
            alert("Please fill out work items")
            return;
        }

        await invoiceModalFormElement.value.scrollTo({top: 0});


        uploadingData.value = true;

        calculateInvoiceTotal();
        
        try { //Add data to firebase DB
            
            const docRef = await setDoc(doc(db, "invoices", docId.value), {
                invoiceUID: invoiceUID.value,
                billerStreetAddress: billerStreetAddress.value,
                billerCity: billerCity.value,
                billerZipCode: billerZipCode.value,
                billerCountry: billerCountry.value,
                clientName: clientName.value,
                clientEmail: clientEmail.value,
                clientStreetAddress: clientStreetAddress.value,
                clientCity: clientCity.value,
                clientZipCode: clientZipCode.value,
                clientCountry: clientCountry.value,
                paymentTerms: paymentTerms.value, 
                paymentDueDateUnix: paymentDueDateUnix.value, 
                paymentDueDate: paymentDueDate.value,
                productDescription: productDescription.value, 
                invoiceItemList: invoiceItemList.value, 
                invoiceTotal: invoiceTotal.value
            }, { merge: true });
        } catch (e) {
            console.error("Error adding document: ", e);
        }

        uploadingData.value = false;

        const data = {
            docId: docId.value,
            routeId: invoiceId
        }

        mainStore.UPDATE_INVOICE(data)

        mainStore.invoiceModal = false
    }

</script>

<style scoped lang="scss">
    .item-list .heading, .item-list .items {
        display: grid;
        grid-template-columns: 6fr 2fr 3fr 3fr 1fr;
    }

    .invoice-wrap {
        position: fixed;
        top: 0;
        left: 0;
        background-color: transparent;
        width: 100%;
        height: 100vh;
        overflow-y: hidden;
        z-index: 5;

        @media (min-width: 900px) {
            left: 90px;
        }

        .invoice-content {
            position: relative;
            padding: 56px;
            max-width: 700px;
            width: 100%;
            background-color: #141625;
            color: #fff;
            box-shadow: 10px 4px 6px -1px rgba(0,0,0,0.2), 0px 2px 4px -1px rgba(0,0,0,0.06);
            overflow-y: scroll;


            &.loading {
                overflow-y: hidden;
            }

            h1 {
                margin-bottom: 48px;
                color: #fff;
            }

            h3 {
                margin-bottom: 16px;
                font-size: 18px;
                color: #777f98;
            }

            h4 {
                color: #7c5dfa;
                font-size: 12px;
                margin-bottom: 24px;
            }

            .bill-to, .bill-from {
                margin-bottom: 48px;

                .location-details{
                    .input:not(:first-of-type) {
                        width: calc(100% - 16px) !important;
                        margin-left: 16px !important;
                    }

                    div {
                        flex: 1;
                    }
                }
            }

            .invoice-work {
                .payment {
                    .input:not(:first-of-type) {
                        width: calc(100% - 16px) !important;
                        margin-left: 16px !important;
                    }

                    div {
                        flex: 1;
                    }
                }

                .work-items {
                    .item-list {
                        width: 100%;

                        .heading {
                            margin-bottom: 16px;
                        }

                        .heading, .items {
                            font-size: 12px;

                            .item-name {
                                width: calc(100% - 18px);
                            }

                            .price {
                                width: calc(100% - 18px);
                                margin-left: 18px;
                            }

                            .total {
                                width: calc(100% - 18px);
                                margin-left: 18px;
                                display: flex;
                                justify-content: left;
                                align-items: center;
                            }
                        }

                        .items {
                            position: relative;
                            margin-bottom: 24px;

                            img {
                                position: absolute;
                                top: 15px;
                                right: 0;
                                width: 12px;
                                height: 16px;
                            }

                            
                        }

                        
                    }

                    .button {
                        color: #fff;
                        background-color: #252945;
                        align-items: center;
                        justify-content: center;
                        width: 100%;

                        img {
                            margin-right: 4px;
                        }
                    }
                }
            }

            .save {
                margin-top: 60px;

                div {
                    flex: 1;
                }

                .right {
                    justify-content: flex-end;
                }
            }
        }

        .input {
            margin-bottom: 24px;
        }

        label {
            font-size: 12px;
            margin-bottom: 6px;
        }

        input, select {
            width: 100%;
            background-color: #1e2139;
            color: #fff;
            border-radius: 4px;
            padding: 12px 4px;
            border: none;

            &:focus {
                outline: none;
            }
        }
    }
</style>