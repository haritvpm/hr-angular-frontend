export getLeaveStatusText(status: string): string {
    if (status == 'Y') {
      return 'Approved';
    }
    if (status == 'N') {
      return 'Pending';
    }
    if (status == 'C') {
      return 'Cancelled';
    }
    if (status == 'R') {
      return 'Rejected';
    }
    return 'Unknown';

  }