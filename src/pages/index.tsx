import VoteForm from "../components/VoteForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div style={{ width: "75%", margin: "0 auto" }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            24년도 성과 공유회 투표
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            모두 고생하였지만, 가장 성과가 뛰어나다고 생각하는 팀에 투표해주세요
          </p>
        </div>

        <div
          className="bg-white shadow-xl rounded-2xl p-8"
          style={{ width: "75%", margin: "0 auto" }}
        >
          <VoteForm />
        </div>
        <div style={{ height: "30px" }}></div>

        <div className="mt-8 text-center">
          <Link
            href="/results"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            View Results →
          </Link>
        </div>
      </div>
    </div>
  );
}
