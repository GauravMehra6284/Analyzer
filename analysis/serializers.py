from rest_framework import serializers
from .models import Skill, Course, UserSkill

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class SkillGapSerializer(serializers.ModelSerializer):
    currentLevel = serializers.SerializerMethodField()
    requiredLevel = serializers.SerializerMethodField()
    courses = CourseSerializer(many=True)
    demandScore = serializers.IntegerField(source='demand_score')

    class Meta:
        model = Skill
        fields = ['name', 'importance', 'demandScore', 'currentLevel', 'requiredLevel', 'courses']

    def get_currentLevel(self, obj):
        user = self.context['request'].user
        skill_record = UserSkill.objects.filter(user=user, skill=obj).first()
        return skill_record.current_level if skill_record else 0

    def get_requiredLevel(self, obj):
        user = self.context['request'].user
        skill_record = UserSkill.objects.filter(user=user, skill=obj).first()
        return skill_record.required_level if skill_record else 70  # default required


from rest_framework import serializers
from .models import ResumeAnalysis

class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysis
        fields = '__all__'
        read_only_fields = [
            'file_name', 'ats_score', 'clarity_score', 'skills_match', 'job_matches',
            'experience', 'education', 'strengths', 'weaknesses'
        ]

