import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DealStatus = 'prospective' | 'active' | 'closed' | 'dead';
export type ProcessType = 'lihtc' | 'bonds' | 'capital' | 'dueDiligence' | 'closing';

export interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  type: 'equity' | 'debt' | 'architect' | 'marketStudy' | 'nonProfit' | 'other';
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  assignedTo?: string;
  notes?: string;
}

export interface Process {
  id: string;
  type: ProcessType;
  name: string;
  status: 'notStarted' | 'inProgress' | 'completed';
  progress: number;
  startDate?: Date;
  dueDate?: Date;
  checklist: ChecklistItem[];
}

export interface Deal {
  id: string;
  name: string;
  address: string;
  status: DealStatus;
  dateAdded: Date;
  dateUpdated: Date;
  siteData: any; // This will store all the site evaluation data
  processes: Process[];
  contacts: Contact[];
  notes: string;
}

interface PipelineState {
  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id' | 'dateAdded' | 'dateUpdated'>) => void;
  updateDeal: (id: string, deal: Partial<Deal>) => void;
  updateDealStatus: (id: string, status: DealStatus) => void;
  addProcess: (dealId: string, process: Omit<Process, 'id'>) => void;
  updateProcess: (dealId: string, processId: string, process: Partial<Process>) => void;
  addContact: (dealId: string, contact: Omit<Contact, 'id'>) => void;
  updateContact: (dealId: string, contactId: string, contact: Partial<Contact>) => void;
  removeContact: (dealId: string, contactId: string) => void;
  updateChecklistItem: (
    dealId: string,
    processId: string,
    itemId: string,
    item: Partial<ChecklistItem>
  ) => void;
}

export const usePipelineStore = create<PipelineState>()(
  persist(
    (set) => ({
      deals: [],
      
      addDeal: (deal) => set((state) => ({
        deals: [...state.deals, {
          ...deal,
          id: crypto.randomUUID(),
          dateAdded: new Date(),
          dateUpdated: new Date()
        }]
      })),
      
      updateDeal: (id, updatedDeal) => set((state) => ({
        deals: state.deals.map(deal => 
          deal.id === id 
            ? { ...deal, ...updatedDeal, dateUpdated: new Date() }
            : deal
        )
      })),
      
      updateDealStatus: (id, status) => set((state) => ({
        deals: state.deals.map(deal =>
          deal.id === id
            ? { ...deal, status, dateUpdated: new Date() }
            : deal
        )
      })),
      
      addProcess: (dealId, process) => set((state) => ({
        deals: state.deals.map(deal =>
          deal.id === dealId
            ? {
                ...deal,
                processes: [...deal.processes, { ...process, id: crypto.randomUUID() }],
                dateUpdated: new Date()
              }
            : deal
        )
      })),
      
      updateProcess: (dealId, processId, updatedProcess) => set((state) => ({
        deals: state.deals.map(deal =>
          deal.id === dealId
            ? {
                ...deal,
                processes: deal.processes.map(process =>
                  process.id === processId
                    ? { ...process, ...updatedProcess }
                    : process
                ),
                dateUpdated: new Date()
              }
            : deal
        )
      })),
      
      addContact: (dealId, contact) => set((state) => ({
        deals: state.deals.map(deal =>
          deal.id === dealId
            ? {
                ...deal,
                contacts: [...deal.contacts, { ...contact, id: crypto.randomUUID() }],
                dateUpdated: new Date()
              }
            : deal
        )
      })),
      
      updateContact: (dealId, contactId, updatedContact) => set((state) => ({
        deals: state.deals.map(deal =>
          deal.id === dealId
            ? {
                ...deal,
                contacts: deal.contacts.map(contact =>
                  contact.id === contactId
                    ? { ...contact, ...updatedContact }
                    : contact
                ),
                dateUpdated: new Date()
              }
            : deal
        )
      })),
      
      removeContact: (dealId, contactId) => set((state) => ({
        deals: state.deals.map(deal =>
          deal.id === dealId
            ? {
                ...deal,
                contacts: deal.contacts.filter(contact => contact.id !== contactId),
                dateUpdated: new Date()
              }
            : deal
        )
      })),
      
      updateChecklistItem: (dealId, processId, itemId, updatedItem) => set((state) => ({
        deals: state.deals.map(deal =>
          deal.id === dealId
            ? {
                ...deal,
                processes: deal.processes.map(process =>
                  process.id === processId
                    ? {
                        ...process,
                        checklist: process.checklist.map(item =>
                          item.id === itemId
                            ? { ...item, ...updatedItem }
                            : item
                        )
                      }
                    : process
                ),
                dateUpdated: new Date()
              }
            : deal
        )
      }))
    }),
    {
      name: 'pipeline-storage'
    }
  )
);