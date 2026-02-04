import { SupplierTask } from "@/types/supplier";
import { mockTechnologists } from "@/data/mockStyles";

// Mock supplier tasks - demonstrating the inbox-driven workflow
export const mockSupplierTasks: SupplierTask[] = [
  {
    id: "task-1",
    type: "test_review",
    title: "BASE Test Results Ready",
    description: "Review BASE test results for Men's Crew Neck T-Shirt fabric component",
    priority: "high",
    status: "pending",
    styleId: "style-1",
    styleTuNo: "123456789",
    styleDescription: "Men's Crew Neck T-Shirt",
    componentId: "comp-1",
    testId: "test-1",
    assignedTo: {
      id: "tech-1",
      name: mockTechnologists[0].name,
      role: "Fabric Technologist",
      avatar: mockTechnologists[0].avatar,
    },
    createdAt: "2025-02-01T10:00:00Z",
    dueDate: "2025-02-05T17:00:00Z",
    slaStatus: "at_risk",
  },
  {
    id: "task-2",
    type: "style_approval",
    title: "New Style Submission",
    description: "Review and approve Women's Zip Hoodie style sheet",
    priority: "normal",
    status: "pending",
    styleId: "style-2",
    styleTuNo: "234567890",
    styleDescription: "Women's Zip Hoodie",
    assignedTo: {
      id: "tech-2",
      name: mockTechnologists[1].name,
      role: "Fabric Technologist",
      avatar: mockTechnologists[1].avatar,
    },
    createdAt: "2025-01-28T14:30:00Z",
    dueDate: "2025-02-07T17:00:00Z",
    slaStatus: "on_track",
  },
  {
    id: "task-3",
    type: "gsw_review",
    title: "GSW Ready for Approval",
    description: "Review Gold Seal Workbook for Kids' Printed Joggers",
    priority: "urgent",
    status: "pending",
    styleId: "style-3",
    styleTuNo: "345678901",
    styleDescription: "Kids' Printed Joggers",
    assignedTo: {
      id: "tech-3",
      name: mockTechnologists[2].name,
      role: "Garment Technologist",
      avatar: mockTechnologists[2].avatar,
    },
    createdAt: "2025-02-02T09:00:00Z",
    dueDate: "2025-02-04T17:00:00Z",
    slaStatus: "at_risk",
  },
  {
    id: "task-4",
    type: "query_response",
    title: "Query: Composition Clarification",
    description: "Technologist requires clarification on fabric composition for Men's Organic Cotton Polo",
    priority: "high",
    status: "pending",
    styleId: "style-4",
    styleTuNo: "456789012",
    styleDescription: "Men's Organic Cotton Polo",
    componentId: "comp-7",
    assignedTo: {
      id: "tech-1",
      name: mockTechnologists[0].name,
      role: "Fabric Technologist",
      avatar: mockTechnologists[0].avatar,
    },
    assignedBy: {
      id: "tech-1",
      name: mockTechnologists[0].name,
    },
    createdAt: "2025-02-03T11:00:00Z",
    dueDate: "2025-02-05T17:00:00Z",
    slaStatus: "on_track",
    queryMessage: "Please confirm the organic cotton certification number and provide the GOTS certificate.",
  },
  {
    id: "task-5",
    type: "bulk_approval",
    title: "BULK Test Approval Required",
    description: "Review and approve BULK test results for Kids' 2-Pack Pyjamas",
    priority: "normal",
    status: "pending",
    styleId: "style-6",
    styleTuNo: "678901234",
    styleDescription: "Kids' 2-Pack Pyjamas",
    componentId: "comp-10",
    testId: "test-4",
    assignedTo: {
      id: "tech-5",
      name: mockTechnologists[4].name,
      role: "Fabric Technologist",
      avatar: mockTechnologists[4].avatar,
    },
    createdAt: "2025-01-30T16:00:00Z",
    dueDate: "2025-02-06T17:00:00Z",
    slaStatus: "on_track",
  },
  {
    id: "task-6",
    type: "component_approval",
    title: "New Fabric Component Submitted",
    description: "Review and approve new fabric component for Women's Summer Dress",
    priority: "low",
    status: "pending",
    styleId: "style-5",
    styleTuNo: "567890123",
    styleDescription: "Women's Summer Dress",
    componentId: "comp-9",
    assignedTo: {
      id: "tech-2",
      name: mockTechnologists[1].name,
      role: "Fabric Technologist",
      avatar: mockTechnologists[1].avatar,
    },
    createdAt: "2025-01-28T10:00:00Z",
    dueDate: "2025-02-10T17:00:00Z",
    slaStatus: "on_track",
  },
  {
    id: "task-7",
    type: "care_label_approval",
    title: "Care Labels Updated",
    description: "Review updated care labels for Men's Crew Neck T-Shirt",
    priority: "normal",
    status: "completed",
    styleId: "style-1",
    styleTuNo: "123456789",
    styleDescription: "Men's Crew Neck T-Shirt",
    assignedTo: {
      id: "tech-1",
      name: mockTechnologists[0].name,
      role: "Fabric Technologist",
      avatar: mockTechnologists[0].avatar,
    },
    createdAt: "2025-01-25T14:00:00Z",
    dueDate: "2025-01-30T17:00:00Z",
    completedAt: "2025-01-29T11:30:00Z",
    slaStatus: "on_track",
  },
  {
    id: "task-8",
    type: "test_review",
    title: "BASE Test Results Ready",
    description: "Review BASE test results for Kids' Printed Joggers fabric",
    priority: "normal",
    status: "completed",
    styleId: "style-3",
    styleTuNo: "345678901",
    styleDescription: "Kids' Printed Joggers",
    componentId: "comp-6",
    testId: "test-3",
    assignedTo: {
      id: "tech-5",
      name: mockTechnologists[4].name,
      role: "Fabric Technologist",
      avatar: mockTechnologists[4].avatar,
    },
    createdAt: "2025-01-10T09:00:00Z",
    dueDate: "2025-01-15T17:00:00Z",
    completedAt: "2025-01-12T16:00:00Z",
    slaStatus: "on_track",
  },
];

// Helper functions
export const getPendingTasks = (): SupplierTask[] =>
  mockSupplierTasks.filter(t => t.status === "pending");

export const getTasksByTechnologist = (techId: string): SupplierTask[] =>
  mockSupplierTasks.filter(t => t.assignedTo.id === techId);

export const getTasksByStyle = (styleId: string): SupplierTask[] =>
  mockSupplierTasks.filter(t => t.styleId === styleId);

export const getUrgentTasks = (): SupplierTask[] =>
  mockSupplierTasks.filter(t => t.priority === "urgent" && t.status === "pending");

export const getOverdueTasks = (): SupplierTask[] =>
  mockSupplierTasks.filter(t => t.slaStatus === "overdue" && t.status === "pending");

export const getTaskStats = () => {
  const pending = mockSupplierTasks.filter(t => t.status === "pending").length;
  const urgent = mockSupplierTasks.filter(t => t.priority === "urgent" && t.status === "pending").length;
  const atRisk = mockSupplierTasks.filter(t => t.slaStatus === "at_risk" && t.status === "pending").length;
  const overdue = mockSupplierTasks.filter(t => t.slaStatus === "overdue" && t.status === "pending").length;
  const completed = mockSupplierTasks.filter(t => t.status === "completed").length;
  
  return { pending, urgent, atRisk, overdue, completed, total: mockSupplierTasks.length };
};
