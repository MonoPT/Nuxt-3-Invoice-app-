import { defineStore } from 'pinia'
import { InvoiceModal } from '~~/.nuxt/components'
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, query, getDocs, doc, deleteDoc, setDoc   } from "firebase/firestore";
import db from "@/fireabse/firebaseINIT"

export const useMainStore = defineStore({
  id: 'main',
  state: () => {
    return {
        invoiceModal: false,
        invoiceData: [],
        invoicesLoaded: false,
        editInvoice: false,
        currentInvoice: <any>{}
    }
  },
  actions: {
    TOGGLE_INVOICE() : void {
        this.invoiceModal = !this.invoiceModal;
    },
    async GET_INVOICES() {
        let newInvoices = []
        const q = query(collection(db, "invoices"));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if(!this.invoiceData.some(invoice => invoice.id === doc.id)) {
                const data = {
                    docId: doc.id,
                    invoiceUID: doc.data().invoiceUID,
                    invoiceId: doc.data().invoiceUID.slice(0,6),
                    billerStreetAddress: doc.data().billerStreetAddress,
                    billerCity: doc.data().billerCity,
                    billerZipCode: doc.data().billerZipCode,
                    billerCountry: doc.data().billerCountry,
                    clientName: doc.data().clientName,
                    clientEmail: doc.data().clientEmail,
                    clientStreetAddress: doc.data().clientStreetAddress,
                    clientCity: doc.data().clientCity,
                    clientZipCode: doc.data().clientZipCode,
                    clientCountry: doc.data().clientCountry,
                    invoiceDateUnix: doc.data().invoiceDateUnix,
                    invoiceDate: doc.data().invoiceDate,
                    paymentTerms: doc.data().paymentTerms, 
                    paymentDueDateUnix: doc.data().paymentDueDateUnix, 
                    paymentDueDate: doc.data().paymentDueDate,
                    productDescription: doc.data().productDescription, 
                    invoicePending: doc.data().invoicePending,
                    invoiceDraft: doc.data().invoiceDraft,
                    invoiceItemList: doc.data().invoiceItemList, 
                    invoiceTotal: doc.data().invoiceTotal,
                    invoicePaid: doc.data().invoicePaid
                }

                newInvoices.push(data);
                
            }
            
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
        });
        
        this.SET_INVOICE_DATA(newInvoices)
        this.invoicesLoaded = true;
    },
    SET_INVOICE_DATA(data) {
        this.invoiceData = [];
        data.forEach(element => {
            this.invoiceData.push(element);
        });
        
    },
    TOGGLE_EDIT_INVOICE() {
        this.editInvoice = !this.editInvoice;
    },
    async UPDATE_INVOICE({docId, routeId}) {
        await this.GET_INVOICES();
        this.TOGGLE_INVOICE();
        this.TOGGLE_EDIT_INVOICE();

        const currentInvoice = [...this.invoiceData].find(invoice => {
            if(invoice.invoiceUID === routeId) return invoice;
        });
        this.currentInvoice = currentInvoice
        this.editInvoice = false;
        this.invoiceModal = false;
    },
    async DELTE_INVOICE(docId) {
        await deleteDoc(doc(db, "invoices", docId));

        this.invoiceData = this.invoiceData.filter((item) => {
            if(docId !== item.docId) return item
        })
    },
    UPDATE_STATUS_TO_PAID(docId) {
        this.invoiceData.forEach( async (invoice) => {
            if(invoice.docId === docId) {
                invoice.invoicePaid = true;
                invoice.invoicePending = false;

                const docRef = await setDoc(doc(db, "invoices", docId), {
                    invoicePaid: true,
                    invoicePending: false
                }, { merge: true });
            }
        });
    },
    async UPDATE_STATUS_TO_PENDING(docId) {
        this.invoiceData.forEach(async (invoice) => {
            if(invoice.docId === docId) {
                invoice.invoicePaid = false;
                invoice.invoicePending = true;
                invoice.invoiceDraft = false; 

                const docRef = await setDoc(doc(db, "invoices", docId), {
                    invoicePaid: false,
                    invoicePending: true,
                    invoiceDraft: false
                }, { merge: true });
            }
        });
        
    }
  },
  getters: {
    
  },
})