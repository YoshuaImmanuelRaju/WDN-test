from fastapi import APIRouter, UploadFile, File, HTTPException
from services.uploadService import process_epanet_upload

router = APIRouter(
    prefix="/networks",
    tags=["Networks"]
)


@router.post("/upload")
async def upload_network(file: UploadFile = File(...)):
    """
    Upload EPANET .inp file and process it
    """

    try:
        # ✅ Validate file extension
        if not file.filename.endswith(".inp"):
            raise HTTPException(
                status_code=400,
                detail="Only .inp files are supported"
            )

        # ✅ Process upload
        network = await process_epanet_upload(file)

        return network

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )