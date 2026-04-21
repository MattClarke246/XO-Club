# Monthly Profit Workbook Template

Use Google Sheets or Airtable. Keep one workbook, one tab per month for raw exports if needed.

## Required Tabs

1. `OrdersRaw`
2. `RefundsRaw`
3. `FeesRaw`
4. `ShippingRaw`
5. `AppsAndFixedCosts`
6. `ProfitSummary`

## ProfitSummary Fields (minimum)

- Month
- GrossSales
- Discounts
- Refunds
- PaymentFees
- ShippingCosts
- OtherAgreedCosts
- NetProfitBase
- MaintenanceShare15Percent
- PayoutDueDate
- PayoutStatus

## Formula Reference

NetProfitBase:

```
=GrossSales-Discounts-Refunds-PaymentFees-ShippingCosts-OtherAgreedCosts
```

MaintenanceShare15Percent:

```
=NetProfitBase*0.15
```

## Recommended Monthly Export Sources

- Shopify finance/sales report for gross + discounts
- Shopify refunds report
- Payment transaction fee export
- Shipping label/fulfillment cost export
- App/subscription and approved additional cost list

## Control Checks

- [ ] Each source export has matching date range
- [ ] Refunds are not double-counted
- [ ] Shipping costs include only merchant-paid costs
- [ ] Any manual adjustments are logged with reason and approver
