from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Case

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
        category = request.data.get('category')
        subcategories = request.data.getlist('subCategories')  # Get all values with the same key
        
        # Validate required fields
        if not all([victim_name, mobile_number, address, category]) or not subcategories:
            return Response({
                'message': 'Victim name, mobile number, address, category, and at least one subcategory are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the case
        case = Case.objects.create(
            user=request.user,
            victim_name=victim_name,
            mobile_number=mobile_number,
            address=address,
            category=category,
            subcategories=subcategories
        )
        
        return Response({
            'message': 'Case created successfully!',
            'case_id': case.id
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'message': f'Failed to create case: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_cases(request):
    cases = Case.objects.filter(user=request.user).order_by('-created_at')
    
    case_list = []
    for case in cases:
        case_list.append({
            'id': case.id,
            'victim_name': case.victim_name,
            'mobile_number': case.mobile_number,
            'address': case.address,
            'category': case.category,
            'status': case.status,
            'created_at': case.created_at
        })
    
    return Response(case_list, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def case_detail(request, pk):
    case = get_object_or_404(Case, id=pk, user=request.user)
    
    case_data = {
        'id': case.id,
        'victim_name': case.victim_name,
        'mobile_number': case.mobile_number,
        'address': case.address,
        'category': case.category,
        'subcategories': case.subcategories,
        'status': case.status,
        'created_at': case.created_at,
        'updated_at': case.updated_at
    }
    
    return Response(case_data, status=status.HTTP_200_OK)