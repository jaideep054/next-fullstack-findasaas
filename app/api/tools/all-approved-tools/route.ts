import { NextResponse , NextRequest} from 'next/server';
import { getAllApprovedTools } from '@/service/toolService';


export async function GET() {

  // console.log(NextRequest, "-.>>>>>>>>>>>>>>.")
  try {
    const tools = await getAllApprovedTools();
    return NextResponse.json({ success: true, data: tools });
  } catch (error: any) {
    console.error('Error fetching approved tools:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
