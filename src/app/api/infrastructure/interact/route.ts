import { NextRequest, NextResponse } from "next/server";
import { toggleLikeProject, addProjectComment, getProjectComments } from "@/lib/services/campaigns";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { project_id, voter_id, action, comment_text } = body;

        if (!project_id || !voter_id || !action) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (action === "like") {
            const success = await toggleLikeProject(Number(project_id), Number(voter_id));
            return NextResponse.json({ success });
        }

        if (action === "comment") {
            if (!comment_text) return NextResponse.json({ error: "Comment text required" }, { status: 400 });
            const comment = await addProjectComment(Number(project_id), Number(voter_id), comment_text);
            return NextResponse.json(comment);
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Action failed" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("project_id");

    if (!projectId) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

    try {
        const comments = await getProjectComments(Number(projectId));
        return NextResponse.json(comments);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}
