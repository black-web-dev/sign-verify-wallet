// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

const API_URL = process.env.NEXT_PUBLIC_API || "http://44.200.116.229:3000";

export default function checkStatus(req: NextApiRequest, res: NextApiResponse) {
  const { requestNo, address } = req.query;

  const data = {
    requestNo,
    address,
  };

  const formData = new URLSearchParams();

  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value as string);
  }

  return fetch(`${API_URL}/checkStatus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      res.status(200).json({ status: data.status, message: data.message });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(200).json({ status: -1, message: "No Request Found" });
    });
}
