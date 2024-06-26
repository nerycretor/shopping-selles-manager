import { Button } from "@/components/ui/button"
import { ArrowLeft } from "@mynaui/icons-react"
import {Document, Page, View, Text, PDFViewer, StyleSheet} from "@react-pdf/renderer"
import { useLocation, useNavigate } from "react-router-dom"


export default function BillsPage(){

    const navigate = useNavigate()
    const location = useLocation()

    function handleGoBack(){
        navigate(-1)
    }

    return (
        <div className="w-screen h-screen">
            <Button variant={"link"} onClick={handleGoBack} className="font-bold flex gap-1.5"> <ArrowLeft /> VOLTAR</Button>
            <PDFViewer width={"100%"} height={"100%"}>
                <Bill 
                    clientName={location.state.receiver}
                    transactionType={location.state.type}
                    transactionDescription={location.state.productName}
                    productQuantity={location.state.quantity}
                    productPrice={location.state.price}
                />
            </PDFViewer>
        </div>
    )
}

const styles = StyleSheet.create({
    header: {
        fontWeight: "bold",
        textAlign: "center",
        padding: 30
    }
})

interface Bill {
    clientName: string
    transactionType: string
    transactionDescription: string
    productQuantity: string
    productPrice: string
}

function Bill({clientName, transactionType, transactionDescription, productPrice, productQuantity}: Bill){
    return (
        <Document>
            <Page size="A4" >
                <View style={styles.header}>
                    <Text style={{fontWeight: "bold", color: "red"}}>BCODER SHOPP</Text>
                    <Text>__________________________________________________</Text>
                </View>
                <View style={{display: "flex",flexDirection: "row", paddingHorizontal: 48, justifyContent: "space-between"}}>
                    <Text style={{fontWeight: "bold", fontSize: 24}}>FATURA</Text>
                    <Text>{new Date().toLocaleDateString()}</Text>
                </View>
                <View style={{display: "flex",flexDirection: "row", paddingHorizontal: 48,marginTop: 20, justifyContent: "space-between"}}>
                    <View style={{display: "flex", flexDirection: "column", gap: 8}}>
                        <Text style={{fontWeight: "bold"}}>De:</Text>
                        <Text>BCODER SHOPP</Text>
                    </View>
                    <View style={{display: "flex", flexDirection: "column", gap: 8}}>
                        <Text style={{fontWeight: "bold"}}>Para:</Text>
                        <Text>{clientName}</Text>
                    </View>
                </View>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginHorizontal: 48, marginTop: 20, backgroundColor: "#778899", padding: 8}}>
                    <Text>Transacao</Text>
                    <Text>Descricao</Text>
                    <Text>Quantidade</Text>
                    <Text>Preco</Text>
                </View>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginHorizontal: 48, marginTop: 8}}>
                    <Text>{transactionType}</Text>
                    <Text>{transactionDescription}</Text>
                    <Text>{productQuantity}</Text>
                    <Text>{productPrice},00</Text>
                </View>
                <View style={{display: "flex",flex: 1, flexDirection: "row", justifyContent: "flex-end", paddingRight: 48, marginTop: 15}}>
                    <Text>TOTAL: {Number(productPrice)},00</Text>
                </View>
            </Page>
        </Document>
    )
}