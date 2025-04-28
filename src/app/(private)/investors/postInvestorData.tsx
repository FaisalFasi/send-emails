"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

// Sample investor data array structure
import { sampleInvestorsData } from "@/lib/investorsDummyData";
import { unknown } from "zod";

export default function PostInvestorData() {
  const [isPosting, setIsPosting] = useState(false);
  const [postCount, setPostCount] = useState(0);

  const postDataToFirestore = async (
    data: (typeof sampleInvestorsData)[0][]
  ) => {
    setIsPosting(true);
    try {
      const results = [];
      let successCount = 0;

      for (const investor of data) {
        try {
          const response = await fetch("/api/investors", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(investor),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          results.push(result);
          successCount++;
        } catch (error) {
          console.error(
            `Error posting investor ${investor.firstName} ${investor.lastName}:`,
            error
          );
          results.push({ error: unknown, data: investor });
        }
      }

      setPostCount((prev) => prev + successCount);
      toast.success(
        `Posted ${successCount}/${data.length} investors successfully!`
      );
      console.log("Post results:", results);
      return results;
    } catch (error) {
      console.error("Batch post error:", error);
      toast.error("Failed to post some data");
      throw error;
    } finally {
      setIsPosting(false);
    }
  };

  const postSingleInvestor = () =>
    postDataToFirestore([sampleInvestorsData[0]]);
  const postAllInvestors = () => postDataToFirestore(sampleInvestorsData);
  const postRandomInvestor = () => {
    const randomIndex = Math.floor(Math.random() * sampleInvestorsData.length);
    return postDataToFirestore([sampleInvestorsData[randomIndex]]);
  };

  return (
    <div className="p-4 border rounded-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Post Investor Data to Firestore
        </h2>
        <div className="text-sm text-gray-500">Total posted: {postCount}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium">Sample Data Preview:</h3>
          <div className="text-xs bg-gray-100 p-2 rounded overflow-auto h-64">
            <pre>
              {JSON.stringify(sampleInvestorsData.slice(0, 2), null, 2)}
            </pre>
            {sampleInvestorsData.length > 2 && (
              <div className="text-gray-500 mt-2">
                + {sampleInvestorsData.length - 2} more investors...
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Post Actions:</h3>
          <div className="space-y-2">
            <Button
              onClick={postSingleInvestor}
              disabled={isPosting}
              className="w-full"
              variant="outline"
            >
              {isPosting ? "Posting..." : "Post First Investor"}
            </Button>
            <Button
              onClick={postRandomInvestor}
              disabled={isPosting}
              className="w-full"
              variant="outline"
            >
              {isPosting ? "Posting..." : "Post Random Investor"}
            </Button>
            <Button
              onClick={postAllInvestors}
              disabled={isPosting}
              className="w-full"
            >
              {isPosting
                ? "Posting..."
                : `Post All ${sampleInvestorsData.length} Investors`}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Custom Data:</h3>
          <div className="text-xs bg-gray-100 p-2 rounded h-64 flex flex-col">
            <textarea
              id="customData"
              className="flex-1 w-full p-2 font-mono text-xs bg-white rounded"
              placeholder={`Paste custom investor data here in JSON format, e.g.:\n${JSON.stringify(sampleInvestorsData[0], null, 2)}`}
              defaultValue={JSON.stringify(sampleInvestorsData[0], null, 2)}
            />
            <Button
              onClick={() => {
                try {
                  const textarea = document.getElementById(
                    "customData"
                  ) as HTMLTextAreaElement;
                  const data = JSON.parse(textarea.value);
                  postDataToFirestore(Array.isArray(data) ? data : [data]);
                } catch (error) {
                  toast.error("Invalid JSON format");
                  console.error("JSON parse error:", error);
                }
              }}
              disabled={isPosting}
              className="mt-2 w-full"
              variant="secondary"
            >
              Post Custom Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
