from pathlib import Path
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware

class BusinessRegisterRequest(BaseModel):
    hostname: Optional[str]
    username: Optional[str]
    business_name: Optional[str]
    business_address: Optional[str]
    business_phone: Optional[str]
    business_email: Optional[str]
    
class BusinessRegisterResponse(BaseModel):
    id: Optional[str]
    hostname: Optional[str]
    username: Optional[str]
    business_name: Optional[str]
    business_address: Optional[str]
    business_phone: Optional[str]
    business_email: Optional[str]
    
    
class CustomerRegisterRequest(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    preferred_contact_method: Optional[str]
    preferred_time_of_contact: Optional[str]
    
class CustomerRegisterResponse(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    preferred_contact_method: Optional[str]
    preferred_time_of_contact: Optional[str]
    id: Optional[str]
    
class AcceptContractRequest(BaseModel):
    signature: Optional[str]
    username: Optional[str]
    entity_id: Optional[str]

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

list_of_businesses = []
list_of_customers = []

@app.post('/business')
def register_business(request: BusinessRegisterRequest):
    response = BusinessRegisterResponse(id=len(list_of_businesses)-1, **request.model_dump())
    list_of_businesses.append(response)
    return response

@app.put('/business/{business_id}')
def update_business(business_id: int, request: BusinessRegisterRequest):
    if business_id < len(list_of_businesses):
        list_of_businesses[business_id] = request
        return request
    else:
        raise HTTPException(status_code=404, detail="Business not found")
    
@app.delete('/business/{business_id}')
def delete_business(business_id: int):
    if business_id < len(list_of_businesses):
        del list_of_businesses[business_id]
        return {"message": "Business deleted"}
    else:
        raise HTTPException(status_code=404, detail="Business not found")

@app.get('/business')
def get_businesses(business_id: int | None = None, business_name: str | None = None):
    if business_id:
        return list_of_businesses[business_id]
    elif business_name:
        for register in list_of_businesses:
            if register.business_name == business_name:
                return register
    return list_of_businesses

@app.post('/customer')
def register_customer(request: CustomerRegisterRequest):
    response = CustomerRegisterResponse(id=len(list_of_customers)-1, **request.model_dump())
    list_of_customers.append(response)
    return response

@app.put('/customer/{customer_id}')
def update_customer(customer_id: int, request: CustomerRegisterRequest):
    if customer_id < len(list_of_customers):
        list_of_customers[customer_id] = request
        return request
    else:
        raise HTTPException(status_code=404, detail="Customer not found")

@app.delete('/customer/{customer_id}')
def delete_customer(customer_id: int):
    if customer_id < len(list_of_customers):
        del list_of_customers[customer_id]
        return {"message": "Customer deleted"}
    else:
        raise HTTPException(status_code=404, detail="Customer not found")

@app.get('/customer')
def get_register(customer_id: int | None = None, name: str | None = None):
    if customer_id:
        return list_of_customers[customer_id]
    elif name:
        for register in list_of_customers:
            if register.name == name:
                return CustomerRegisterResponse(id=customer_id, **register.model_dump())
    return list_of_customers

# Create contract based on incoming pdf
@app.post('/contract')
async def create_contract(file: UploadFile = File(...)):
    contents = await file.read()
    # check if file is pdf
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=415, detail="Unsupported file type")
    # check if file is too big
    if len(contents) > 1000000:
        raise HTTPException(status_code=413, detail="File too large")
    # check if file is not empty
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="File is empty")
    return {"message": "Contract created"}

@app.put('/contract/{contract_id}')
def update_contract(contract_id: int, request: AcceptContractRequest):
    return {"message": "Contract updated"}
    
@app.get('/contract')
def get_contract():
    pdfName = "Photography_Services_Agreement.pdf"
    pdf_path = Path(pdfName)  # Path to your existing PDF file

    # Check if the file exists
    if not pdf_path.is_file():
        raise HTTPException(status_code=404, detail="PDF not found")

    # Open the file in binary mode
    pdf_file = open(pdf_path, "rb")

    # Serve the PDF as a streaming response
    return StreamingResponse(pdf_file, media_type="application/pdf", headers={"Content-Disposition": "inline; filename=${pdfName}"})


@app.post('/contract/{contract_id}/accept')
def accept_contract(contract_id: int, request: AcceptContractRequest):
    return {"message": "Contract accepted"}

@app.get('/contract/{contract_id}/decline')
def decline_contract(contract_id: int):
    return {"message": "Contract declined"}

@app.get('/contract/{contract_id}/view')
def view_contract(contract_id: int):
    return {"message": "Contract viewed"}

@app.get('/bookings/{business_id}')
def get_bookings(username: str | None = None):
    if username:
        return {"message": "Bookings retrieved for user " + username}
    
    return {"message": "Retrieving all bookings"}
