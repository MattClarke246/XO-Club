# SOP: Monthly Profit Report and 15% Payout

## Purpose

Generate a monthly profit statement and maintenance payout amount based on agreed Net Profit Base formula.

## Roles

- Report owner: Provider
- Approver: Client finance owner
- Payout executor: Client finance owner

## Timeline (example)

- Day 1-2: export reports
- Day 3: prepare workbook
- Day 5: client review/approval
- Day 7: payout

## Procedure

1. Export data for prior month from Shopify:
   - orders/sales
   - discounts
   - refunds
   - fees
   - shipping costs
2. Update `OrdersRaw`, `RefundsRaw`, `FeesRaw`, `ShippingRaw` tabs.
3. Update `AppsAndFixedCosts` with approved monthly cost lines.
4. Recalculate `ProfitSummary`.
5. Verify formula integrity and date ranges.
6. Share report with client for approval.
7. Issue invoice/payment request for `MaintenanceShare15Percent`.
8. Record payout completion status.

## Approval Checklist

- [ ] Date range is correct
- [ ] Cost categories match contract addendum
- [ ] NetProfitBase and 15% are calculated by formula
- [ ] Client approval captured in writing
