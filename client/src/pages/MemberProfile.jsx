// src/components/MemberProfile.jsx
import { formatDate } from '../utils/formatters';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  BookOpen,
  Heart,
  Smartphone,
  FileText,
  Home,
  Users,
  Activity,
  Award,
  Shield,
  IdCard,
  GraduationCap,
  Stethoscope,
  BookMarked,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Globe,
  Flag,
  CreditCard,
} from "lucide-react";

const MemberProfile = ({ member }) => {
  if (!member) return null;

  const renderStatusBadge = (status) => {
    const colors = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status || 'Pending'}
      </span>
    );
  };

  const renderSection = (title, icon, children) => (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
        {icon}
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );

  const renderField = (label, value, fallback = 'Not specified') => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value || fallback}</span>
    </div>
  );

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto px-2">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img
          src={member.photo || '/default-avatar.png'}
          alt={member.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
            {renderStatusBadge(member.verificationStatus)}
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
            <span className="capitalize">{member.gender}</span>
            <span>•</span>
            <span className={member.isAlive ? 'text-green-600' : 'text-red-600'}>
              {member.isAlive ? 'Living' : 'Deceased'}
            </span>
            {member.generation && (
              <>
                <span>•</span>
                <span>Generation {member.generation}</span>
              </>
            )}
            {member.familyNumber && (
              <>
                <span>•</span>
                <span>Family #{member.familyNumber}</span>
              </>
            )}
            {member.rollNumber && (
              <>
                <span>•</span>
                <span>Roll #{member.rollNumber}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      {renderSection('Personal Information', <User className="h-4 w-4 text-gray-500" />,
        <>
          {renderField('Date of Birth', formatDate(member.dob))}
          {renderField('Place of Birth', member.placeOfBirth)}
          {renderField('Blood Group', member.bloodGroup)}
          {renderField('Marital Status', member.maritalStatus)}
          {renderField('Occupation', member.occupation)}
          {renderField('Education', member.education)}
          {renderField('Religion', member.religion)}
          {renderField('Caste/Ethnicity', member.casteEthnicity)}
          {renderField('Nationality', member.nationality)}
          {!member.isAlive && renderField('Date of Death', formatDate(member.dod))}
        </>
      )}

      {/* Contact Information */}
      {renderSection('Contact Information', <Smartphone className="h-4 w-4 text-gray-500" />,
        <>
          {renderField('Mobile Number', member.phone)}
          {renderField('Alternative Mobile', member.alternatePhone)}
          {renderField('Email', member.email)}
        </>
      )}

      {/* Address Information */}
      {renderSection('Address Information', <Home className="h-4 w-4 text-gray-500" />,
        <>
          {renderField('House Number', member.houseNumber)}
          {renderField('Ward Number', member.wardNumber)}
          {renderField('Tole/Village', member.toleVillage)}
          {renderField('Municipality', member.municipality)}
          {renderField('District', member.district)}
          {renderField('Province', member.province)}
          {renderField('Country', member.country)}
          {renderField('Current Address', member.currentAddress)}
          {renderField('Permanent Address', member.permanentAddress)}
          {renderField('Postal Code', member.postalCode)}
        </>
      )}

      {/* Family Information */}
      {renderSection('Family Information', <Users className="h-4 w-4 text-gray-500" />,
        <>
          {renderField('Family', member.family?.familyName)}
          {renderField('Family Number', member.familyNumber)}
          {renderField('Roll Number', member.rollNumber)}
          {renderField('Generation', member.generation)}
          {renderField('Relationship', member.relationship)}
          {renderField('Father', member.father?.name)}
          {renderField('Mother', member.mother?.name)}
          {renderField('Grandfather', member.grandfather?.name)}
          {renderField('Grandmother', member.grandmother?.name)}
          {renderField('Spouse', member.spouse?.name)}
          {renderField('Guardian', member.guardian?.name)}
          {renderField('Family Contact', member.familyContact)}
        </>
      )}

      {/* Identification */}
      {renderSection('Identification', <IdCard className="h-4 w-4 text-gray-500" />,
        <>
          {renderField('Citizenship Number', member.citizenshipNumber)}
          {renderField('Citizenship Issue Date', formatDate(member.citizenshipIssueDate))}
          {renderField('Citizenship Issue District', member.citizenshipIssueDistrict)}
          {renderField('NID Number', member.nationalIdNumber)}
          {renderField('NID Issue Date', formatDate(member.nationalIdIssueDate))}
        </>
      )}

      {/* Passport */}
      {renderSection('Passport', <IdCard className="h-4 w-4 text-gray-500" />,
        <>
          {renderField('Passport Number', member.passportNumber)}
          {renderField('Passport Issue Date', formatDate(member.passportIssueDate))}
          {renderField('Passport Expiry Date', formatDate(member.passportExpiryDate))}
        </>
      )}

      {/* Driving License */}
      {renderSection('Driving License', <CreditCard className="h-4 w-4 text-gray-500" />,
        <>
          {renderField('License Number', member.drivingLicenseNumber)}
          {renderField('License Category', member.drivingLicenseCategory)}
          {renderField('License Issue Date', formatDate(member.drivingLicenseIssueDate))}
          {renderField('License Expiry Date', formatDate(member.drivingLicenseExpiryDate))}
        </>
      )}

      {/* Documents */}
      {renderSection('Documents', <FileText className="h-4 w-4 text-gray-500" />,
        <>
          {renderField('Birth Certificate', member.birthCertificate)}
          {renderField('Marriage Certificate', member.marriageCertificate)}
          {renderField('Death Certificate', member.deathCertificate)}
          {renderField('PAN Card', member.panCard)}
          {renderField('Voter ID', member.voterId)}
        </>
      )}

      {/* Additional Information */}
      {renderSection('Additional Information', <BookMarked className="h-4 w-4 text-gray-500" />,
        <>
          {member.biography && (
            <div className="col-span-2">
              <span className="text-xs text-gray-500">Biography</span>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{member.biography}</p>
            </div>
          )}
          {member.notes && (
            <div className="col-span-2">
              <span className="text-xs text-gray-500">Notes</span>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{member.notes}</p>
            </div>
          )}
          {member.specialRemarks && (
            <div className="col-span-2">
              <span className="text-xs text-gray-500">Special Remarks</span>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{member.specialRemarks}</p>
            </div>
          )}
          {member.medicalNotes && (
            <div className="col-span-2">
              <span className="text-xs text-gray-500">Medical Notes</span>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{member.medicalNotes}</p>
            </div>
          )}
          {member.disabilityInfo && (
            <div className="col-span-2">
              <span className="text-xs text-gray-500">Disability Information</span>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{member.disabilityInfo}</p>
            </div>
          )}
        </>
      )}

      {/* Status */}
      {renderSection('Status', <Activity className="h-4 w-4 text-gray-500" />,
        <>
          {renderField('Status', member.status)}
          {renderField('Verification Status', member.verificationStatus, renderStatusBadge(member.verificationStatus))}
        </>
      )}
    </div>
  );
};

export default MemberProfile;