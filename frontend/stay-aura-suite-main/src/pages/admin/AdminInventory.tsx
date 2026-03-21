import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { inventoryApi } from "@/api/services";

const EMPTY = { itemName: "", category: "", quantity: "", unit: "", description: "" };

interface Item { itemId: number; itemName: string; category: string; quantity: number; unit: string; description: string; }

export default function AdminInventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => {
    setLoading(true);
    inventoryApi.getAll().then(r => setItems(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal("add"); };
  const openEdit = (item: Item) => {
    setEditing(item);
    setForm({ itemName: item.itemName, category: item.category ?? "", quantity: String(item.quantity ?? ""), unit: item.unit ?? "", description: item.description ?? "" });
    setModal("edit");
  };

  const handleSave = async () => {
    const payload = { ...form, quantity: form.quantity ? Number(form.quantity) : undefined };
    if (modal === "add") await inventoryApi.create(payload);
    else if (editing) await inventoryApi.update(editing.itemId, payload);
    setModal(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    await inventoryApi.delete(id);
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader title="Inventory Management" subtitle="Track hotel supplies and assets" />
        <button onClick={openAdd} className="px-5 py-2.5 bg-accent text-accent-foreground font-body text-sm font-medium rounded-lg shadow-gold hover:shadow-elevated transition-all">
          Add Item
        </button>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body text-sm">Loading...</p>
      ) : (
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Item Name</th>
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Category</th>
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Quantity</th>
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Unit</th>
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Description</th>
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No items found.</td></tr>
              ) : items.map(item => (
                <tr key={item.itemId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-foreground font-medium">{item.itemName}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.category || "—"}</td>
                  <td className="px-6 py-4 text-foreground">{item.quantity ?? "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.unit || "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{item.description || "—"}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(item)} className="text-ocean hover:text-accent text-xs font-medium transition-colors">Edit</button>
                    <button onClick={() => handleDelete(item.itemId)} className="text-destructive hover:text-destructive/80 text-xs font-medium transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl shadow-elevated p-8 w-full max-w-md space-y-4">
            <h2 className="text-lg font-display font-semibold text-foreground">{modal === "add" ? "Add Item" : "Edit Item"}</h2>
            <div className="space-y-3">
              {([
                { key: "itemName", label: "Item Name" },
                { key: "category", label: "Category" },
                { key: "unit", label: "Unit" },
                { key: "description", label: "Description" },
              ] as { key: keyof typeof EMPTY; label: string }[]).map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs font-body text-muted-foreground mb-1 block">{label}</label>
                  <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
              ))}
              <div>
                <label className="text-xs font-body text-muted-foreground mb-1 block">Quantity</label>
                <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="flex-1 py-2.5 bg-accent text-accent-foreground font-body text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">Save</button>
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border text-foreground font-body text-sm font-medium rounded-lg hover:bg-muted transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
