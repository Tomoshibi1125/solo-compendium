# Content Audit System

The Solo Compendium app includes a comprehensive content audit system to analyze database content quality and completeness.

## Features

### ✅ Implemented

- **Table Statistics**: Counts entries per compendium table
- **Completeness Metrics**: Calculates data completeness percentage
- **Field Analysis**: Tracks missing descriptions, images, source books, tags
- **Quality Recommendations**: Generates actionable recommendations
- **Export Functionality**: Export audit report as JSON
- **Real-time Refresh**: Update audit data on demand

### 📊 Metrics Tracked

For each compendium table:

1. **Total Count**: Number of entries
2. **With Description**: Entries that have descriptions
3. **With Image**: Entries that have image URLs
4. **With Source Book**: Entries with source book information
5. **With Tags**: Entries with tags
6. **Completeness Score**: Weighted percentage (40% description, 30% image, 20% source, 10% tags)

### 📋 Tables Audited

The system audits all compendium tables:

- `compendium_jobs` - Character classes
- `compendium_job_paths` - Subclass paths
- `compendium_job_features` - Class features
- `compendium_powers` - Spells/techniques
- `compendium_relics` - Magic items
- `compendium_equipment` - Standard equipment
- `compendium_monsters` - Creatures
- `compendium_backgrounds` - Character backgrounds
- `compendium_conditions` - Status conditions
- `compendium_feats` - Feats
- `compendium_skills` - Skills
- `compendium_monarchs` - Monarch overlays
- `compendium_monarch_features` - Monarch features
- `compendium_sovereigns` - Sovereign combinations
- `compendium_sovereign_features` - Sovereign features
- `compendium_runes` - Runes
- `compendium_shadow_soldiers` - Shadow soldiers

## Usage

### Accessing the Audit

1. Navigate to `/admin`
2. Click "Content Audit" button
3. Or navigate directly to `/admin/audit`

### Reading the Report

**Summary Cards:**
- Total Entries: Overall count across all tables
- Completeness: Average completeness percentage
- With Images: Percentage of entries with images
- With Descriptions: Percentage of entries with descriptions

**Table Statistics:**
- Detailed breakdown per table
- Shows counts and percentages for each metric
- Sorted by total count (largest first)

**Recommendations:**
- Actionable suggestions for improving content
- Prioritized by importance
- Based on completeness thresholds

### Exporting the Report

Click "Export JSON" to download a complete audit report including:
- Timestamp
- All table statistics
- Summary metrics
- Recommendations

## Completeness Scoring

The completeness score is calculated as a weighted average:

- **40%** - Description presence
- **30%** - Image presence
- **20%** - Source book presence
- **10%** - Tags presence

**Score Interpretation:**
- **80-100%**: Excellent - Content is complete
- **60-79%**: Good - Minor improvements needed
- **Below 60%**: Needs attention - Significant gaps

## Recommendations

The system generates recommendations based on:

1. **Overall Completeness**: Warns if below 50%, suggests improvements if below 75%
2. **Image Coverage**: Alerts if less than 30% have images
3. **Description Coverage**: Warns if less than 80% have descriptions
4. **Empty Tables**: Lists tables with no entries
5. **Low Completeness Tables**: Highlights tables below 50% completeness
6. **Missing Source Books**: Alerts if significant entries lack source information

## Best Practices

### Regular Audits

- Run audits after major content imports
- Check monthly for content quality
- Use before major releases

### Acting on Recommendations

1. **High Priority**: Address recommendations marked with ⚠️
2. **Medium Priority**: Improve completeness scores below 75%
3. **Low Priority**: Enhance entries with missing optional fields

### Content Improvement

Focus on:
1. Adding descriptions to entries without them
2. Generating/adding images for visual entries
3. Ensuring source book attribution
4. Adding relevant tags for better searchability

## Technical Details

### Performance

- Audits run in parallel for all tables
- Results cached for 5 minutes
- Efficient count queries (head: true)

### Error Handling

- Gracefully handles missing tables
- Continues audit even if some tables fail
- Logs errors for debugging

### Data Privacy

- Audit only reads public compendium data
- No user data is included
- Safe to run in production

## Future Enhancements

- Historical tracking (compare audits over time)
- Content gap analysis (identify missing content types)
- Automated content quality checks
- Integration with content import system
- Content health dashboard

