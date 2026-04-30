import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

const AdminCustomers = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [customers, setCustomers] = useState([]);
  const [showDoc, setShowDoc] = useState({ open: false, url: "", type: "" });

  const token = localStorage.getItem("adminToken");

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/auth/admin/customers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDocStatusChange = async (userId, docType, status) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/auth/admin/customers/${userId}/verify`,
        { docType, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCustomers((prev) =>
        prev.map((c) => (c._id === userId ? data.user : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-6 py-6 text-white">

      <h2 className="text-2xl font-bold mb-6">
        All <span className="text-yellow-500">Customers</span>
      </h2>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white/5 border border-yellow-500/20 rounded-xl backdrop-blur-md">

        <table className="min-w-full text-sm">

         {/* HEADER */}
<thead className="bg-yellow-500/10 text-yellow-400 uppercase text-xs tracking-wider">
  <tr>
    <th className="px-6 py-4 text-left">Name</th>
    <th className="px-6 py-4 text-left">Email</th>
    <th className="px-6 py-4 text-left">Phone</th>
    <th className="px-6 py-4 text-center">Aadhaar</th>
    <th className="px-6 py-4 text-center">Driving Licence</th>
  </tr>
</thead>

{/* BODY */}
<tbody className="divide-y divide-gray-800">

  {customers.map((cust) => (
    <tr
      key={cust._id}
      className="hover:bg-yellow-500/5 transition duration-200"
    >

      {/* NAME */}
      <td className="px-6 py-4 text-white font-medium">
        {cust.name}
      </td>

      {/* EMAIL */}
      <td className="px-6 py-4 text-gray-300">
        {cust.email}
      </td>

      {/* PHONE */}
      <td className="px-6 py-4 text-gray-400">
        {cust.phone}
      </td>

      {/* AADHAAR */}
      <td className="px-6 py-4 text-center">

        <button
          onClick={() =>
            setShowDoc({
              open: true,
              url: cust.aadhaar.path,
              type: "Aadhaar",
            })
          }
          className="text-yellow-400 text-xs hover:underline"
        >
          View
        </button>

        <div className="mt-2 flex flex-col items-center gap-1">

          {cust.aadhaar.status === "Approved" ? (
            <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs">
              Approved
            </span>
          ) : cust.aadhaar.status === "Rejected" ? (
            <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs">
              Rejected
            </span>
          ) : (
            <div className="flex gap-2 mt-1">

              <button
                onClick={() =>
                  handleDocStatusChange(cust._id, "aadhaar", "Approved")
                }
                className="bg-yellow-500 text-black px-2 py-1 text-xs rounded hover:bg-yellow-400"
              >
                ✔
              </button>

              <button
                onClick={() =>
                  handleDocStatusChange(cust._id, "aadhaar", "Rejected")
                }
                className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-400"
              >
                ✕
              </button>

            </div>
          )}

        </div>

      </td>

      {/* DRIVING LICENCE */}
      <td className="px-6 py-4 text-center">

        <button
          onClick={() =>
            setShowDoc({
              open: true,
              url: cust.drivingLicence.path,
              type: "Driving Licence",
            })
          }
          className="text-yellow-400 text-xs hover:underline"
        >
          View
        </button>

        <div className="mt-2 flex flex-col items-center gap-1">

          {cust.drivingLicence.status === "Approved" ? (
            <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs">
              Approved
            </span>
          ) : cust.drivingLicence.status === "Rejected" ? (
            <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs">
              Rejected
            </span>
          ) : (
            <div className="flex gap-2 mt-1">

              <button
                onClick={() =>
                  handleDocStatusChange(
                    cust._id,
                    "drivingLicence",
                    "Approved"
                  )
                }
                className="bg-yellow-500 text-black px-2 py-1 text-xs rounded hover:bg-yellow-400"
              >
                ✔
              </button>

              <button
                onClick={() =>
                  handleDocStatusChange(
                    cust._id,
                    "drivingLicence",
                    "Rejected"
                  )
                }
                className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-400"
              >
                ✕
              </button>

            </div>
          )}

        </div>

      </td>

    </tr>
  ))}

</tbody>

        </table>

      </div>

      {/* DOCUMENT MODAL */}
      {showDoc.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">

          <div className="bg-white/5 border border-yellow-500/20 rounded-xl w-full max-w-4xl max-h-[90vh] p-6 overflow-auto relative">

            <h3 className="text-xl font-semibold mb-4">
              {showDoc.type} Preview
            </h3>

            {showDoc.url ? (
              (() => {
                const isImage = showDoc.url.match(/\.(jpeg|jpg|png|gif)$/i);
                const isPDF = showDoc.url.match(/\.pdf$/i);

                if (isImage) {
                  return (
                    <img
                      src={`${API_URL}/${showDoc.url}`}
                      alt="Document"
                      className="w-full rounded border border-gray-700"
                    />
                  );
                } else if (isPDF) {
                  return (
                    <iframe
                      src={`${API_URL}/${showDoc.url}`}
                      className="w-full h-[80vh] rounded border border-gray-700"
                    />
                  );
                } else {
                  return (
                    <p className="text-red-500">
                      Cannot preview this file type.
                    </p>
                  );
                }
              })()
            ) : (
              <p className="text-gray-500">No document uploaded.</p>
            )}

            <button
              onClick={() => setShowDoc({ open: false, url: "", type: "" })}
              className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 text-xl"
            >
              ✕
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminCustomers;