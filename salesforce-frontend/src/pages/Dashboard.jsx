import { useEffect, useState } from "react";
import { FaCloud, FaSpinner, FaSyncAlt } from "react-icons/fa";

import {
  login,
  getRules,
  toggleRule,
  deployChanges,
  getUser,
  logout,
} from "../api/salesforce.api";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const [user, setUser] = useState(null);

  const [metadataLoading, setMetadataLoading] = useState(false);
  const [rules, setRules] = useState([]);

  const [deploying, setDeploying] = useState(false);

  // fetch user info after login
  const fetchUser = async () => {
    try {
      const res = await getUser();
      setUser(res.data);
      setConnected(true);
    } catch (err) {
      setConnected(false);
      setUser(null);
    }
  };

  // LOGIN
  const handleLogin = () => {
    setLoading(true);
    login();
  };

  // GET METADATA
  const handleGetMetadata = async () => {
    try {
      setMetadataLoading(true);

      const res = await getRules();

      setTimeout(() => {
        setRules(res.data);
        setMetadataLoading(false);
      }, 2000);
    } catch (err) {
      console.log(err);
      setMetadataLoading(false);
    }
  };

  // TOGGLE RULE
  const toggleStatus = async (rule) => {
    try {
      await toggleRule(rule.id, !rule.active);

      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, active: !r.active } : r)),
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ENABLE ALL
  const handleEnableAll = async () => {
    try {
      setDeploying(true);

      for (let rule of rules) {
        if (!rule.active) {
          await toggleRule(rule.id, true);
        }
      }

      setRules((prev) => prev.map((r) => ({ ...r, active: true })));

      setDeploying(false);
      alert("All rules enabled successfully!");
    } catch (err) {
      console.log(err);
      setDeploying(false);
    }
  };

  // DISABLE ALL
  const handleDisableAll = async () => {
    try {
      setDeploying(true);

      for (let rule of rules) {
        if (rule.active) {
          await toggleRule(rule.id, false);
        }
      }

      setRules((prev) => prev.map((r) => ({ ...r, active: false })));

      setDeploying(false);
      alert("All rules disabled successfully!");
    } catch (err) {
      console.log(err);
      setDeploying(false);
    }
  };

  // DEPLOY
  const handleDeploy = async () => {
    try {
      setDeploying(true);

      await deployChanges();

      setTimeout(() => {
        setDeploying(false);
        alert("Changes deployed successfully!");
      }, 2000);
    } catch (err) {
      console.log(err);
      setDeploying(false);
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await logout();
      setConnected(false);
      setUser(null);
      setRules([]);
    } catch (err) {
      console.log(err);
    }
  };

  // when page loads, check if already logged in
  // useState(() => {
  //   fetchUser();
  // }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Salesforce Metadata Dashboard
          </h1>
          <p className="text-slate-500 mt-2">
            Manage validation rules, workflows and triggers
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <select className="border border-slate-300 rounded-xl px-4 py-3 bg-white shadow-sm outline-none">
            <option>Production</option>
            <option>Sandbox</option>
          </select>

          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Accessing Salesforce...
              </>
            ) : (
              <>
                <FaCloud /> LOGIN
              </>
            )}
          </button>
        </div>
      </div>

      {/* USER INFO CARD */}
      {connected && user && (
        <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">{user.username}</h2>

          <p className="text-slate-500 mt-1">
            Organization: {user.organization}
          </p>

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow"
            >
              Logout
            </button>

            <button
              onClick={handleGetMetadata}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow"
            >
              Get Metadata
            </button>
          </div>
        </div>
      )}

      {/* METADATA LOADING */}
      {metadataLoading && (
        <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-slate-200">
          <div className="flex items-center gap-3 text-blue-600 font-semibold">
            <FaSpinner className="animate-spin" />
            Querying Metadata...
          </div>

          <p className="text-slate-500 mt-3">
            Building a list of validation rules, workflows and triggers...
          </p>
        </div>
      )}

      {/* RULES TABLE */}
      {connected && rules.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Validation Rules
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Enable or disable Salesforce metadata
              </p>
            </div>

            {/* RIGHT BUTTONS */}
            <div className="flex flex-col gap-3 items-end">
              <div className="flex gap-3">
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow">
                  <FaSyncAlt /> Rollback
                </button>

                <button
                  onClick={handleDeploy}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold shadow"
                >
                  Deploy Changes
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleEnableAll}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow"
                >
                  Enable All
                </button>

                <button
                  onClick={handleDisableAll}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-semibold shadow"
                >
                  Disable All
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="text-left px-6 py-4">Name</th>
                  <th className="text-left px-6 py-4">Type</th>
                  <th className="text-left px-6 py-4">Active</th>
                  <th className="text-left px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {rules.map((rule, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-5 font-medium text-slate-700">
                      {rule.name}
                    </td>

                    <td className="px-6 py-5 text-slate-600">{rule.type}</td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          rule.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {rule.active ? "✔ Active" : "✖ Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <button
                        onClick={() => toggleStatus(rule)}
                        className={`px-4 py-2 rounded-xl text-white font-medium shadow ${
                          rule.active
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {rule.active ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DEPLOY MODAL */}
      {deploying && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 text-center shadow-2xl w-87.5">
            <FaSpinner className="animate-spin text-5xl text-blue-600 mx-auto mb-5" />

            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Processing...
            </h3>

            <p className="text-slate-500">
              Please wait while metadata updates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
