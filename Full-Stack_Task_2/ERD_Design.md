# Entity Relationship Diagram (ERD) for PSSMS

## Entities and Attributes

### 1. ParkingSlot
- SlotNumber (Primary Key)
- SlotStatus (Available/Occupied)

### 2. Car  
- PlateNumber (Primary Key)
- DriverName
- PhoneNumber

### 3. ParkingRecord
- RecordID (Primary Key - Auto-generated)
- PlateNumber (Foreign Key → Car.PlateNumber)
- SlotNumber (Foreign Key → ParkingSlot.SlotNumber)
- EntryTime
- ExitTime
- Duration (Calculated)

### 4. Payment
- PaymentID (Primary Key - Auto-generated)
- RecordID (Foreign Key → ParkingRecord.RecordID)
- AmountPaid
- PaymentDate

## Relationships and Cardinalities

1. **Car to ParkingRecord**: One-to-Many (1:N)
   - One car can have multiple parking records
   - Car.PlateNumber → ParkingRecord.PlateNumber

2. **ParkingSlot to ParkingRecord**: One-to-Many (1:N)
   - One parking slot can have multiple parking records over time
   - ParkingSlot.SlotNumber → ParkingRecord.SlotNumber

3. **ParkingRecord to Payment**: One-to-One (1:1)
   - Each parking record has exactly one payment
   - ParkingRecord.RecordID → Payment.RecordID

## ERD Diagram (Text Representation)

```
┌─────────────────┐       ┌──────────────────┐       ┌─────────────────┐
│   ParkingSlot   │       │  ParkingRecord   │       │     Payment     │
├─────────────────┤       ├──────────────────┤       ├─────────────────┤
│ SlotNumber (PK) │◀──────│ SlotNumber (FK)  │       │ PaymentID (PK)  │
│ SlotStatus      │       │ RecordID (PK)    │◀──────│ RecordID (FK)   │
└─────────────────┘       │ PlateNumber (FK) │───────┤ AmountPaid      │
                          │ EntryTime        │       │ PaymentDate     │
                          │ ExitTime         │       └─────────────────┘
                          │ Duration         │
                          └──────────────────┘
                                   │
                                   │
                          ┌─────────────────┐
                          │      Car        │
                          ├─────────────────┤
                          │ PlateNumber(PK) │
                          │ DriverName      │
                          │ PhoneNumber     │
                          └─────────────────┘
```

## Key Design Decisions

1. **Primary Keys**: 
   - ParkingSlot.SlotNumber (Natural Key)
   - Car.PlateNumber (Natural Key)
   - ParkingRecord.RecordID (Surrogate Key - Auto-increment)
   - Payment.PaymentID (Surrogate Key - Auto-increment)

2. **Foreign Keys**: 
   - ParkingRecord references both Car and ParkingSlot
   - Payment references ParkingRecord

3. **Calculated Fields**:
   - Duration in ParkingRecord will be calculated automatically
   - AmountPaid will be calculated based on duration (500 RWF/hour)

4. **Business Rules**:
   - Each parking record must have exactly one payment
   - A car can be parked in only one slot at a time
   - Each slot can accommodate only one car at a time
