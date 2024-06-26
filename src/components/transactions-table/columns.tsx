import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod"

export const transactionSchema = z.object({
    id: z.string().optional(),
    type: z.string(),
    owner: z.string(),
    receiver: z.string(),
    productName: z.string(),
    price: z.number(),
    quantity: z.number(),
    createdAt: z.string().optional().default(new Date().toLocaleDateString())
})

export type Transaction = z.infer<typeof transactionSchema>

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'type',
        header: 'Transacao'
    },

    {
        accessorKey: 'owner',
        header: 'Owner'
    },

    {
        accessorKey: 'receiver',
        header: 'Destinatario'
    },

    {
        accessorKey: 'productName',
        header: 'Nome do Produto'
    },

    {
        accessorKey: 'price',
        header: 'Preco'
    },

    {
        accessorKey: 'quantity',
        header: 'Quantidade'
    },

    {
        accessorKey: 'createdAt',
        header: 'Data'
    },
]
