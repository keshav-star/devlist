"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Copy, Play } from "lucide-react";
import { generateAndSetToken, verifyToken } from "@/app/actions/user.actions";
import { toast } from "sonner";

export function LandingDialog({ token }: { token: string | null }) {
  const [name, setName] = useState("");
  const [generatedValue, setGeneratedValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstLand, setFirstLand] = useState<"new" | "old" | "">("");
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!token) {
      setShowDialog(true);
    }
  }, [token]);

  const resetValues = () => {
    setName("");
    setGeneratedValue("");
    setCopied(false);
    setFirstLand("");
  };

  const handleGenerate = async () => {
    setLoading(true);
    // Simulate generation
    try {
      const result = await generateAndSetToken(name);
      setGeneratedValue(result.token);
      setCopied(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    setLoading(true);
    // Simulate validation
    try {
      const result = await verifyToken(name);
      if (!result.success) toast.error(result.message);
      setGeneratedValue(name);
      setCopied(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedValue);
    setCopied(true);
  };

  const handleClose = () => {
    if (token) setShowDialog(false);
    resetValues();
  };
  return (
    <Dialog open={showDialog} onOpenChange={handleClose}>
      <DialogOverlay />
      <DialogContent className="bg-gray-100 p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-5">
            {" "}
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Play className="h-4 w-4 text-white" />
            </div>{" "}
            <div className="text-xl">Welcome to the Devlist</div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!generatedValue ? (
            <div>
              {firstLand === "" ? (
                <div className="flex items-center justify-center gap-5 mt-5">
                  <Button
                    className="bg-blue-600 text-white"
                    onClick={() => setFirstLand("old")}
                    disabled={loading}
                  >
                    I already have token
                  </Button>
                  <Button
                    className="bg-blue-600 text-white"
                    onClick={() => setFirstLand("new")}
                    disabled={loading}
                  >
                    Generate New token
                  </Button>
                </div>
              ) : (
                <>
                  <Input
                    placeholder={
                      firstLand === "new" ? "Enter your Name" : "Enter Token"
                    }
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <div className="flex gap-2">
                    <Button
                      className="bg-blue-600 text-white"
                      onClick={
                        firstLand === "new" ? handleGenerate : handleValidate
                      }
                      disabled={loading}
                    >
                      {firstLand === "new" ? "Generate" : "Validate"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setName("");
                        setFirstLand("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="">
              <div className="flex items-center gap-2 my-4">
                <Input value={generatedValue} disabled />
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  <Copy className="w-4 h-4" />
                </Button>
                {copied && (
                  <span className="text-sm text-green-600">Copied!</span>
                )}
              </div>
              <div className="text-red-500 text-center font-semibold">
                This is generated only 1 time. Please keep it saved.
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
