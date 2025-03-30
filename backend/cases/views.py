from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Case, CaseDocument, CaseVideo

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_case(request):
    if not request.user.is_authenticated:
        return Response({
            'message': 'User must be logged in to create a case.'
        }, status=status.HTTP_401_UNAUTHORIZED)
    try:
        # Extract basic case information
        victim_name = request.data.get('victimName')
        mobile_number = request.data.get('mobileNumber')
        address = request.data.get('address')
        statement = request.data.get('statement')
        
        # Validate required fields
        if not all([victim_name, mobile_number, address]):
            return Response({
                'message': 'Victim name, mobile number, and address are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the case if user exists
        case = Case.objects.create(
            user=request.user,
            victim_name=victim_name,
            mobile_number=mobile_number,
            address=address,
            statement=statement
        )
        print(f"Case created: {case}")
        # Handle document uploads
        documents = []
        for key in request.FILES:
            if key.startswith('document_'):
                document = request.FILES[key]
                case_document = CaseDocument.objects.create(
                    case=case,
                    document=document
                )
                documents.append(case_document.id)
        
        # Handle video upload
        video = None
        if 'videoFile' in request.FILES:
            video_file = request.FILES['videoFile']
            case_video = CaseVideo.objects.create(
                case=case,
                video=video_file
            )
            video = case_video.id
        
        return Response({
            'message': 'Case created successfully!',
            'case_id': case.id,
            'documents': documents,
            'video': video
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'message': f'Failed to create case: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_cases(request):
    print("Listing cases")
    print(f"User: {request.user}")  # Log the user for debugging
    cases = Case.objects.filter(user=request.user).order_by('-created_at')
    
    case_list = []  # Initialize the case list
    for case in cases:
        case_list.append({
            'id': case.id,
            'victim_name': case.victim_name,
            'mobile_number': case.mobile_number,
            'status': case.status,
            'created_at': case.created_at,
            'document_count': case.documents.count(),
            'has_video': case.videos.exists()
        })
    print(case_list)
    print(case_list)  # Log the case list for debugging
    return Response(case_list, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def case_detail(request, case_id):
    case = get_object_or_404(Case, id=case_id, user=request.user)
    
    # Get documents
    documents = []
    for doc in case.documents.all():
        documents.append({
            'uploaded_at': doc.uploaded_at
        })
    
    # Get video
    videos = []
    for video in case.videos.all():
        videos.append({
            'id': video.id,
            'url': request.build_absolute_uri(video.video.url),
            'uploaded_at': video.uploaded_at
        })
    
    case_data = {
        'id': case.id,
        'victim_name': case.victim_name,
        'mobile_number': case.mobile_number,
        'address': case.address,
        'statement': case.statement,
        'status': case.status,
        'created_at': case.created_at,
        'updated_at': case.updated_at,
        'documents': documents,
        'videos': videos
    }
    
    return Response(case_data, status=status.HTTP_200_OK)
