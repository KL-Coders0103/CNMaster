import { StyleSheet } from "react-native";

export const continueLearningCardStyles = StyleSheet.create({
    continueCard: { 
        marginHorizontal: 24, 
        marginTop: 28, 
        padding: 20, 
        borderRadius: 20, 
        backgroundColor: "#FFFFFF", 
        elevation: 3, 
    }, 
    
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: "700", 
        color: "#111827", 
    }, 
    
    topicTitle: { 
        fontSize: 16, 
        fontWeight: "600", 
        marginTop: 16, 
        color: "#111827", 
    }, 
    
    progressLabel: { 
        marginTop: 8, 
        color: "#6B7280", 
    }, 
    
    progressBar: { 
        height: 10, 
        borderRadius: 999, 
        backgroundColor: "#E5E7EB", 
        marginTop: 16, 
        overflow: "hidden", 
    }, 
    
    progressFill: { 
        width: "65%", 
        height: "100%", 
        backgroundColor: "#2563EB", 
    }, 
    
    resumeButton: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginTop: 20, }, 
    
    resumeText: { 
        color: "#2563EB", 
        fontWeight: "600", 
        marginRight: 8, 
    },
});