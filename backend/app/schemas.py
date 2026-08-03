"""
Pydantic v2 schemas for API requests/responses.
"""
from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class InstitutionSummary(BaseModel):
    id: UUID
    name: str
    uncleared_count: int
    uncleared_amount: Decimal
    model_config = ConfigDict(from_attributes=True)


class UnclearedItem(BaseModel):
    collection_id: UUID
    reference: str
    collection_date: date
    institution_name: str
    gross_amount: Decimal
    days_pending: int


class DiscrepancyItem(BaseModel):
    collection_id: UUID
    reference: str
    institution_name: str
    expected_amount: Decimal
    actual_amount: Optional[Decimal]
    difference: Decimal
    reason: Optional[str]


class AlertItem(BaseModel):
    severity: str
    message: str
    category: str


class MorningReportResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    report_date: date
    generated_at: datetime
    total_collections: int
    matched_count: int
    partial_count: int
    unmatched_count: int
    discrepancy_count: int
    actual_bank_balance: Decimal | None = None
    projected_incoming_7d: Decimal | None = None
    projected_incoming_30d: Decimal | None = None
    total_fees_yesterday: Decimal | None = None
    fee_discrepancies: list | None = None
    uncleared_by_institution: List[InstitutionSummary] | None = None
    top_uncleared_items: List[UnclearedItem] | None = None
    recent_discrepancies: List[DiscrepancyItem] | None = None
    alerts: List[AlertItem]
    model_config = ConfigDict(from_attributes=True)


class MorningReportListResponse(BaseModel):
    items: List[MorningReportResponse]
    page: int
    page_size: int
