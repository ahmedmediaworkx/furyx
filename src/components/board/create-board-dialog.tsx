"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreateBoardDialog() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description })
    });

    setLoading(false);

    if (response.ok) {
      setName("");
      setDescription("");
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-ripple flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-md active:scale-95 duration-200">
          <Plus className="w-5 h-5" />
          New Board
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-bold">Create Workspace</DialogTitle>
          <DialogDescription className="text-base font-medium text-muted-foreground">Create a new workspace for your project.</DialogDescription>
        </DialogHeader>
        <form className="mt-6 space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="board-name" className="font-bold ml-1 text-foreground">Board Name</Label>
            <Input 
              id="board-name" 
              value={name} 
              onChange={(event) => setName(event.target.value)} 
              required 
              placeholder="e.g. Q3 Roadmap"
              className="rounded-xl border-input px-4 py-3 h-12 focus:ring-primary/20 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="board-description" className="font-bold ml-1 text-foreground">Description (optional)</Label>
            <Textarea 
              id="board-description" 
              value={description} 
              onChange={(event) => setDescription(event.target.value)} 
              placeholder="What is this board for?"
              className="rounded-xl border-input px-4 py-3 min-h-[100px] focus:ring-primary/20 transition-all" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-ripple mt-4 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none duration-200"
          >
            {loading ? "Creating..." : "Create Board"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
