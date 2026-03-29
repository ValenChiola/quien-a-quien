import { useState } from "react"
import "./App.css"
import { AddUserForm } from "./components/AddUserForm"
import { Header } from "./components/Header"
import { UserList } from "./components/UserList"
import { Summary } from "./components/Summary"
import { Debts } from "./components/Debts"
import { AddPaymentForm } from "./components/AddPaymentForm"
import { Bills } from "./components/Bills"

export interface User {
    id: string
    name: string
    payments: Payment[]
}

export type Payment = {
    id: string
    fromUserId: User["id"]
    totalAmount: number
    reason: string
} & (
    | {
          mode: "all" | "equal" | "manual"
          splits: {
              userId: User["id"]
              amount: number
          }[]
      }
    | {
          mode: "percentage"
          splits: {
              userId: User["id"]
              percentage: number
          }[]
      }
)

export type PaymentSplit = Payment["splits"][number]
export type PaymentMode = Payment["mode"]

export const MINIMUM_DEBT_AMOUNT = 0.01
export const MAX_NAME_LENGTH = 33

function App() {
    const [users, setUsers] = useState<User[]>([])
    const [payments, setPayments] = useState<Payment[]>([])

    return (
        <main className="container">
            <Header />

            <div className="content">
                <div className="card">
                    <AddUserForm users={users} setUsers={setUsers} />
                    <UserList users={users} setUsers={setUsers} />
                </div>
                <div className="card">
                    <AddPaymentForm users={users} setPayments={setPayments} />
                </div>
                <div className="card">
                    <Summary
                        users={users}
                        payments={payments}
                        setPayments={setPayments}
                    />
                </div>
            </div>
            <div className="bottom-row">
                <Debts users={users} payments={payments} />
                <Bills users={users} payments={payments} />
            </div>
        </main>
    )
}

export default App
